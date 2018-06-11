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
        this.failRes(socket.id, '用户编号不合法！');
      }
      // 存储登录信息
      const userLoginEnds = await app.redis.smembers(
        'chat:user:socket:' + userid
      );
      if (userLoginEnds && userLoginEnds.length > 0) {
        // TODO:多终端登录或重复登录
        await app.redis.sadd('chat:user:socket:' + userid, socket.id);
        await app.redis.set('chat:socket:user:' + socket.id, userid);
      } else {
        await app.redis.sadd('chat:user:socket:' + userid, socket.id);
        await app.redis.set('chat:socket:user:' + socket.id, userid);
        // 加载好友列表并置状态
        const friends = await this.ctx.service.userFriend.findAll(
          { sort: '{"response_time": -1 }' },
          {
            $or: [{ from: userid }, { to: userid }],
            deleted: false,
            state: 2,
          }
        );
        if (friends && friends.lenth > 0) {
          for (let index = 0; index < friends.length; index++) {
            const element = friends[index];
            let friendid;
            if (element.from !== userid) {
              friendid = element.from;
            } else {
              friendid = element.to;
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
      const socket = this.ctx.socket;
      /**
       * userid:string
       */
      const { userid } = obj;
      if (!userid) {
        this.failRes(socket.id, '用户编号不合法！');
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
          .to(socket.id)
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
      const socket = this.ctx.socket;
      const { from, to } = obj;
      if (!from || !to) {
        this.failRes(socket.id, '用户编号不合法！');
      }
      const invalid = app.validator.validate(user_friendValidationRule, {
        from,
        to,
      });
      if (invalid) {
        await app.io
          .of('/chat')
          .to(socket.id)
          .emit('fail', { status: 'fail', description: '请求参数错误！' });
      }

      const isUserExist =
        (await ctx.service.user.hasUser(from)) &&
        (await ctx.service.user.hasUser(to));
      if (!isUserExist) {
        await app.io
          .of('/chat')
          .to(socket.id)
          .emit('fail', { status: 'fail', description: '用户不存在' });
      }

      if (from === to) {
        await app.io
          .of('/chat')
          .to(socket.id)
          .emit('fail', { status: 'fail', description: '不能添加自己为好友' });
      }

      const user_friend = {
        from,
        to,
        request_time: new Date().valueOf(),
        state: 1,
      };

      await ctx.service.userFriend.create(user_friend);

      this.notify(to, 'receive_friend_request', from);

      await app.io
        .of('/chat')
        .to(socket.id)
        .emit('requestAddFriend_success', {});
    }

    async responseAddFriend() {
      const { ctx, app } = this;
      const socket = this.ctx.socket;
      const obj = ctx.args[0];

      const { recordId, from, to, state } = obj;
      const invalid = app.validator.validate(stateValidationRule, {
        recordId,
        state,
      });
      if (invalid) {
        await app.io
          .of('/chat')
          .to(socket.id)
          .emit('fail', { status: 'fail', description: '请求参数不合法！' });
      }
      await ctx.service.userFriend.updateState(recordId, state);
      if (state === 2) {
        const userLoginEnds = await app.redis.smembers(
          'chat:user:socket:' + to
        );
        if (userLoginEnds && userLoginEnds.length > 0) {
          await app.redis.zadd('chat:user:friends:' + from, 1, to);
          await app.redis.zadd('chat:user:friends:' + to, 1, from);
          this.notify(to, 'new_added_friend', {
            friendid: from,
            state: 'online',
          });
          this.notify(from, 'new_added_friend', {
            friendid: to,
            state: 'online',
          });
        } else {
          await app.redis.zadd('chat:user:friends:' + from, 0, to);
          this.notify(from, 'new_added_friend', {
            friendid: to,
            state: 'offline',
          });
        }
      }
      await app.io
        .of('/chat')
        .to(socket.id)
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
     * @param {string} socketid 套接字编号
     * @param {string} message 消息
     */
    async failRes(socketid, message) {
      await app.io
        .of('/chat')
        .to(socketid)
        .emit('fail', message);
    }

    /**
     * TODO:获取用户信息
     */
    getUserInfo() {}
  }
  return Controller;
};
