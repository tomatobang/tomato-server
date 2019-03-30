'use strict';

/**
 *  chat message service
 */
import {
  user_friendValidationRule,
  stateValidationRule,
} from '../../validate/user_friend';
import { Application, Controller } from 'egg';

module.exports = (app: Application) => {
  class ChatController extends Controller {
    async connection() {
      return;
    }

    /**
     * user login
     */
    async login() {
      const obj = this.ctx.args[0];
      const socket = this.ctx.socket;
      const { userid } = obj;
      if (!userid) {
        this.failRes(socket.id, '用户编号不合法！');
      }
      const redisChatService = app.util.redis.redisChatService;
      const userLoginEnds = await redisChatService.findUserSocket(app, userid);
      // save login info
      if (userLoginEnds && userLoginEnds.length > 0) {
        // TODO: support multi client login
        await redisChatService.addUserSocket(app, userid, socket);
        await redisChatService.addSocketUser(app, socket, userid);
      } else {
        await redisChatService.addUserSocket(app, userid, socket);
        await redisChatService.addSocketUser(app, socket, userid);
        // load friend list and set online state
        const friends = await this.ctx.service.userFriend.findAll(
          { sort: '{"response_time": -1 }' },
          {
            $or: [{ from: userid }, { to: userid }],
            deleted: false,
            state: 2,
          }
        );
        if (friends && friends.length > 0) {
          for (let index = 0; index < friends.length; index++) {
            const element = friends[index];
            let friendid;
            if (element.from.toString() !== userid) {
              friendid = element.from.toString();
            } else {
              friendid = element.to.toString();
            }
            const fsockets = await redisChatService.findUserSocket(
              app,
              friendid
            );
            if (fsockets && fsockets.length > 0) {
              await redisChatService.addUserFriend(app, userid, 1, friendid);
              const score = await redisChatService.getUserFriendScore(
                app,
                friendid,
                userid
              );
              // update friend online list
              if (score === '0') {
                await redisChatService.updateUserFriendScore(
                  app,
                  friendid,
                  userid,
                  1
                );
                // push message to friend
                this.notify(friendid, 'friend_online', { userid });
              }
            } else {
              await redisChatService.addUserFriend(app, userid, 0, friendid);
            }
          }
        }
      }
    }

    /**
     * send message api
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
        let newMsg = await this.ctx.service.message.create({
          type: 1,
          from: from,
          to: to,
          content: message,
        });
        this.notify(to, 'message_received', newMsg);
        app.util.push.JPUSH.pushMessage(
          to,
          '你的朋友发来一条消息',
          message
        );
      }
    }

    /**
     * load user online friend list
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
      // load friend online states
      const redisChatService = app.util.redis.redisChatService;
      const friends = await redisChatService.getUserFriends(app, userid);
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
     * send friend request
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
      // TODO: filter repeat request. now we are using db primary key
      await ctx.service.userFriend.create(user_friend);

      this.notify(to, 'receive_friend_request', from);

      await app.io
        .of('/chat')
        .to(socket.id)
        .emit('requestAddFriend_success', {});
    }

    /**
     * response friend request
     */
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
        const redisChatService = app.util.redis.redisChatService;
        const userLoginEnds = await redisChatService.findUserSocket(app, to);
        if (userLoginEnds && userLoginEnds.length > 0) {
          await redisChatService.addUserFriend(app, from, 1, to);
          await redisChatService.addUserFriend(app, to, 1, from);
          this.notify(to, 'new_added_friend', {
            friendid: from,
            state: 'online',
          });
          this.notify(from, 'new_added_friend', {
            friendid: to,
            state: 'online',
          });
        } else {
          await redisChatService.addUserFriend(app, from, 0, to);
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
     * user disconnect
     */
    async disconnect() {
      const { ctx, app } = this;
      const socket = ctx.socket;
      const redisChatService = app.util.redis.redisChatService;
      const userid = await redisChatService.findSocketUser(app, socket);
      if (userid) {
        this.clearUserInfo(ctx, socket, userid);
      }
    }

    /**
     * user logout
     */
    async logout() {
      const { ctx } = this;
      const socket = ctx.socket;
      const obj = ctx.args[0];
      const { userid } = obj;
      this.clearUserInfo(ctx, socket, userid);
    }

    /**
     * clear userinfo in redis and cache
     * @param {string} ctx app context
     * @param {string} socket current socket
     * @param {string} userid userid
     */
    async clearUserInfo(ctx, socket, userid) {
      ctx.logger.info('userid!', userid);
      const redisChatService = app.util.redis.redisChatService;
      if (userid) {
        const friends = await redisChatService.getUserFriends(app, userid);
        let fid = '';
        // update user online list
        for (const end of friends) {
          if (end.length > 10) {
            fid = end;
          }
          // user online
          if (end === '1') {
            const score = await redisChatService.getUserFriendScore(
              app,
              fid,
              userid
            );
            if (score !== 0) {
              await redisChatService.updateUserFriendScore(
                app,
                fid,
                userid,
                -1
              );
            }
            this.notify(fid, 'friend_offline', { userid });
          }
        }
        await redisChatService.deleteSocketUser(app, socket);
        await redisChatService.deleteUserSocket(app, userid, socket);
        await redisChatService.deleteUserFriend(app, userid);
      }
    }

    /**
     * send message
     * @param {string} userid userid
     * @param {string} evtName socket.io event name
     * @param {string} message message
     */
    async notify(userid, evtName, message) {
      const redisChatService = app.util.redis.redisChatService;
      const loginEnds = await redisChatService.findUserSocket(app, userid);
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
     * fail response
     * @param {string} socketid socket id
     * @param {string} message message
     */
    async failRes(socketid, message) {
      await app.io
        .of('/chat')
        .to(socketid)
        .emit('fail', message);
    }
  }
  return ChatController;
};
