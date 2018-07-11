'use strict';

// TODO: TIME_OUT_PAIRS may not support mutil-server deploy
const TIME_OUT_PAIRS = {};
import { Application, Controller } from 'egg';
module.exports = (app: Application) => {
  /**
   * TEST: redis message quene
   */
  app.redis.on('message', (channel, message) => {
    console.log('Receive message %s from channel %s', message, channel);
  });

  class TBController extends Controller {
    /**
     * load current tomato list
     */
    async loadTomato() {
      const obj = this.ctx.args[0];
      const socket = this.ctx.socket;
      const { userid } = obj;

      const tomato = await app.redis.get(userid + ':tomato');
      // remove old-user info as it may switch user at client end
      const old_userid = await app.redis.get(socket.id);
      await app.redis.srem(old_userid + ':socket', socket.id);
      await app.redis.sadd(userid + ':socket', socket.id);
      await app.redis.set(socket.id, userid);

      console.log('send load tomato', tomato);
      await app.io
        .of('/tomatobang')
        .to(socket.id)
        .emit('load_tomato_succeed', tomato ? JSON.parse(tomato) : null);
    }

    /**
     * start tomato
     */
    async startTomato() {
      const obj = this.ctx.args[0];
      const socket = this.ctx.socket;
      this.ctx.logger.info('start_tomato', obj);
      const { userid, tomato, countdown } = obj;
      tomato.startTime = new Date();

      // save toamto info. 10s after it finished
      await app.redis.set(
        userid + ':tomato',
        JSON.stringify(tomato),
        'EX',
        countdown * 60 + 10
      );

      let TIME_OUT_ID = TIME_OUT_PAIRS[userid + ':TIME_OUT_ID'];
      if (TIME_OUT_ID) {
        clearTimeout(TIME_OUT_ID);
      }
      TIME_OUT_ID = setTimeout(
        async userid => {
          let tomato = await app.redis.get(userid + ':tomato');
          if (tomato) {
            tomato = JSON.parse(tomato);
          }
          tomato.endTime = new Date();
          tomato.succeed = 1;
          await this.service.tomato.create(tomato);
          await app.redis.del(userid + ':tomato');
          const socketList = await app.redis.smembers(userid + ':socket');
          for (const item of socketList) {
            await app.io
              .of('/tomatobang')
              .to(item)
              .emit('new_tomate_added', tomato);
          }
          app.util.jpush.pushMessage(
            userid,
            '你完成了一个番茄钟',
            tomato.title
          );
        },
        1000 * 60 * countdown,
        userid
      );
      TIME_OUT_PAIRS[userid + ':TIME_OUT_ID'] = TIME_OUT_ID;

      const socketList = await app.redis.smembers(userid + ':socket');
      for (const so of socketList) {
        if (so !== socket.id) {
          await app.io
            .of('/tomatobang')
            .to(so)
            .emit('other_end_start_tomato', tomato);
        }
      }
    }

    /**
     * tomato breaked
     */
    async breakTomato() {
      const obj = this.ctx.args[0];
      const socket = this.ctx.socket;
      const { userid, tomato } = obj;

      let tomato_doing = await app.redis.get(userid + ':tomato');
      if (!tomato_doing) {
        return;
      }

      tomato_doing = JSON.parse(tomato_doing);
      tomato_doing.endTime = new Date();
      tomato_doing.succeed = 0;
      tomato_doing.breakReason = tomato.breakReason;

      const TIME_OUT_ID = TIME_OUT_PAIRS[userid + ':TIME_OUT_ID'];
      clearTimeout(TIME_OUT_ID);
      const result = await this.service.tomato.create(tomato_doing);
      await app.redis.del(userid + ':tomato');
      if (result) {
        const socketList = await app.redis.smembers(userid + ':socket');
        for (const so of socketList) {
          if (so !== socket.id) {
            await app.io
              .of('/tomatobang')
              .to(so)
              .emit('other_end_break_tomato', tomato_doing);
          }
        }
      }
    }

    /**
     * user disconnect
     */
    async disconnect() {
      const socket = this.ctx.socket;
      app.redis.get(socket.id).then(async userid => {
        this.ctx.logger.info('userid!', userid);
        if (userid) {
          await app.redis.srem(userid + ':socket', socket.id);
          await app.redis.del(socket.id);
        }
      });
    }

    /**
     * user logout
     */
    async logout() {
      const { ctx, app } = this;
      const socket = ctx.socket;
      // TODO: username to userid
      // const obj = ctx.args[0];
      // const { userid } = obj;
      app.redis.get(socket.id).then(async userid => {
        this.ctx.logger.info('userid!', userid);
        if (userid) {
          await app.redis.srem(userid + ':socket', socket.id);
          await app.redis.del(socket.id);
        }
      });
    }
  }
  return TBController;
};
