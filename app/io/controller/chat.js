'use strict';

/**
 * 消息服务
 */
module.exports = app => {
  class Controller extends app.Controller {
    async connection() {
      return;
    }

    async login() {
      const obj = this.ctx.args[0];
      const socket = this.ctx.socket;
      const { userid } = obj;
      let userLoginEnds = await app.redis.get('chat:user:socket:' + userid);
      if (userLoginEnds && userLoginEnds.length > 0) {
        // 已登录
      } else {
        await app.redis.sadd('chat:user:socket:' + userid, socket.id);
        await app.redis.set('chat:socket:user:' + socket.id, userid);
      }
      return;
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
      const { from, to, message } = obj;
      if (message.length >= 516) {
        message = message.slice(0, 500) + '...(输入太长，系统自动截断)';
      }
      if (message) {
        const to_user_ends = await app.redis.smembers('chat:user:socket:' + to);
        for (const end of to_user_ends) {
          if (end) {
            await app.io
              .of('/chat')
              .to(end)
              .emit('message_received', {
                from: from,
                message: message,
              });
          }
        }
      }
      return;
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
      if (userid) {
        await app.io
          .of('/chat')
          .to(this.socket.id)
          .emit('online_friendlist_received', {
            friendlist: [] /*TODO: 确定算法 */,
          });
      }
    }

    /**
     * 发送好友请求
     */
    async sendFriendRequest() {
      const obj = this.ctx.args[0];
      /**
       * userid:string
       * to:{userid}
       * state:number
       */
      const { from, to, state } = obj;
      await this.service.userFriend.create({
        from_userid: from,
        to_userid: to,
        request_time: new Date().valueOf(),
        state: 1,
      });
    }

    /**
     * 断开连接
     */
    async disconnect() {
      const socket = ctx.socket;
      app.redis.get(socket.id).then(userid => {
        ctx.logger.info('userid!', userid);
        if (userid) {
          app.redis.srem('chat:user:socket:', userid).then(() => {});
          app.redis.del('chat:socket:user:' + socket.id).then(() => {});
        }
      });
      return;
    }
  }
  return Controller;
};
