'use strict';

/**
 *  消息服务
 */
const {
  user_friendValidationRule,
  stateValidationRule,
} = require('../../validate/user_friend');

module.exports = app => {
  class Controller extends app.Controller {
    async connection() {
      return;
    }

    async login() {
      const obj = this.ctx.args[0];
      const socket = this.ctx.socket;
      const { userid } = obj;
      if (!userid) {
        this.failRes(this.app, this.socket.id, '用户编号不合法！');
      }
      // 存储登录信息
      await app.redis.sadd('chat:user:socket:' + userid, socket.id);
      await app.redis.set('chat:socket:user:' + socket.id, userid);
      const userLoginEnds = await app.redis.smembers(
        'chat:user:socket:' + userid
      );
      if (userLoginEnds && userLoginEnds.length > 0) {
        // TODO:多终端登录或重复登录
      } else {
        // 加载好友列表并置状态
        const friends = await this.service.findAll(
          { sort: '{"response_time": -1 }' },
          {
            $or: [{ from_userid: userid }, { to_userid: userid }],
            deleted: false,
            state: 2,
          }
        );
        if (friends && friends.lenth > 0) {
          for (let index = 0; index < friends.length; index++) {
            const element = friends[index];
            let friendid;
            if (element.from_userid !== userid) {
              friendid = element.from_userid;
            } else {
              friendid = element.to_userid;
            }
            const fsockets = await app.redis.smembers(
              'chat:user:socket:' + friendid
            );
            if (fsockets && fsockets.length > 0) {
              await app.redis.zadd('chat:user:friends:' + userid, 1, friendid);
              const score = await app.redis.zscore(
                'chat:user:friends:' + friendid,
                userid
              );
              // 置用户在线标识
              if (score === 0) {
                await app.redis.zincrby(
                  'chat:user:friends:' + friendid,
                  1,
                  userid
                );
                // 向好友终端推送离线消息
                this.notify(friendid, 'friend_online', { userid });
              }
            } else {
              await app.redis.zadd('chat:user:friends:' + userid, 0, friendid);
            }
          }
        }
      }
    }

    /**
     * 发送消息
     */
    async sendMessage() {
      const obj = this.ctx.args[0];
      /**
       * from:{userid}
       * to:{userid}
       * message:string
       */
      const { from, to } = obj;
      let { message } = obj;
      if (message.length >= 516) {
        message = message.slice(0, 500) + '...(输入太长，系统自动截断)';
      }
      if (message) {
        // 向各个终端推送离线消息
        this.notify(to, 'message_received', { from, message });
      }
    }

    /**
     * 加载好友列表
     */
    async loadOnlineFriendList() {
      const obj = this.ctx.args[0];
      /**
       * userid:string
       */
      const { userid } = obj;
      if (!userid) {
        this.failRes(this.app, this.socket.id, '用户编号不合法！');
      }
      // 查询所有好友在线列表
      const friends = await app.redis.zrange(
        'chat:user:friends:' + userid,
        0,
        -1,
        'WITHSCORES'
      );
      if (userid) {
        await app.io
          .of('/chat')
          .to(this.socket.id)
          .emit('online_friendlist_received', {
            friendlist: friends,
          });
      }
    }

    /**
     * 发送好友请求
     */
    async requestAddFriend() {
      /**
       * userid:string
       * to:{userid}
       * state:number
       */
      const { ctx, app } = this;
      const obj = ctx.args[0];
      const { from_userid, to_userid } = obj;
      if (!from_userid || !to_userid) {
        this.failRes(app, this.socket.id, '用户编号不合法！');
      }
      const invalid = app.validator.validate(user_friendValidationRule, {
        from_userid,
        to_userid,
      });
      if (invalid) {
        await app.io
          .of('/chat')
          .to(this.socket.id)
          .emit('fail', { status: 'fail', description: '请求参数错误！' });
      }

      const isUserExist =
        (await ctx.service.user.hasUser(from_userid)) &&
        (await ctx.service.user.hasUser(to_userid));
      if (!isUserExist) {
        await app.io
          .of('/chat')
          .to(this.socket.id)
          .emit('fail', { status: 'fail', description: '用户不存在' });
      }

      if (from_userid === to_userid) {
        await app.io
          .of('/chat')
          .to(this.socket.id)
          .emit('fail', { status: 'fail', description: '不能添加自己为好友' });
      }

      const user_friend = {
        from_userid,
        to_userid,
        request_time: new Date().valueOf(),
        state: 1,
      };

      await this.service.userFriend.create(user_friend);

      await app.io
        .of('/chat')
        .to(this.socket.id)
        .emit('requestAddFriend_success', {});
    }

    async responseAddFriend() {
      const { ctx, app } = this;
      const obj = ctx.args[0];
      const { recordId, state } = obj;
      const invalid = app.validator.validate(stateValidationRule, {
        recordId,
        state,
      });
      if (invalid) {
        await app.io
          .of('/chat')
          .to(this.socket.id)
          .emit('fail', { status: 'fail', description: '请求参数不合法！' });
      }
      await ctx.service.userFriend.updateState(recordId, state);
      await app.io
        .of('/chat')
        .to(this.socket.id)
        .emit('responseAddFriend_success', {});
    }

    /**
     * 断开连接
     */
    async disconnect() {
      const { ctx, app } = this;
      const socket = ctx.socket;
      app.redis.get(socket.id).then(async function(userid) {
        ctx.logger.info('userid!', userid);
        if (userid) {
          // 查询所有好友在线列表
          const friends = await app.redis.zrange(
            'chat:user:friends:' + userid,
            0,
            -1,
            'WITHSCORES'
          );

          for (const end of friends) {
            // 好友在线
            // TODO: 格式需要做验证
            if (end[1] === 1) {
              const score = await app.redis.zscore(
                'chat:user:friends:' + end[0],
                userid
              );
              if (score !== 0) {
                await app.redis.zincrby(
                  'chat:user:friends:' + end[0],
                  -1,
                  userid
                );
              }
              // 向好友终端推送离线消息
              this.notify(end[0], 'friend_offline', { userid });
            }
          }

          await app.redis.del('chat:user:friends:' + userid);
          await app.redis.srem('chat:user:socket:', userid);
          await app.redis.del('chat:socket:user:' + socket.id);
        }
      });
    }

    /**
     * 辅助方法
     * @param {string} userid 用户编号
     * @param {string} evtName 事件名称
     * @param {string} message 消息
     */
    async notify(userid, evtName, message) {
      // 向好友终端推送离线消息
      const loginEnds = await app.redis.smembers('chat:user:socket:' + userid);
      if (loginEnds && loginEnds.length > 0) {
        for (const end of loginEnds) {
          if (end) {
            await app.io
              .of('/chat')
              .to(end)
              .emit(evtName, message);
          }
        }
      }
    }

    /**
     * 失败返回
     * @param {string} app app
     * @param {string} socketid 套接字编号
     * @param {string} message 消息
     */
    async failRes(app, socketid, message) {
      await app.io
        .of('/chat')
        .to(socketid)
        .emit('fail', message);
    }
  }
  return Controller;
};
