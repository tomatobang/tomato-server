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
      const redisTomatoService = app.util.redis.redisTomatoService;
      const tomato = await redisTomatoService.findUserTomato(app, userid);
      // remove old-user info as it may switch user at client end
      const old_userid = await redisTomatoService.findSocketUser(app, socket);
      await redisTomatoService.deleteUserSocket(app, old_userid, socket);
      await redisTomatoService.addUserSocket(app, userid, socket);
      await redisTomatoService.addSocketUser(app, socket, userid);

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
      this.ctx.logger.info('start_tomato', obj);
      const { userid, tomato, countdown } = obj;
      tomato.startTime = new Date();

      // save toamto info until it finished +10s
      const redisTomatoService = app.util.redis.redisTomatoService;
      await redisTomatoService.addUserTomato(
        app,
        userid,
        JSON.stringify(tomato),
        countdown * 60 + 10
      );
      this.clearTomatoTimeout(userid);
      const TIME_OUT_ID = setTimeout(
        async userid => {
          let tomato = await redisTomatoService.findUserTomato(app, userid);
          if (tomato) {
            tomato = JSON.parse(tomato);
          }
          tomato.endTime = new Date();
          tomato.succeed = 1;
          await this.service.tomato.create(tomato);
          await redisTomatoService.deleteUserTomato(app, userid);
          this.notify(userid, 'new_tomate_added', tomato);
          app.util.push.JPUSH.pushMessage(
            userid,
            '你完成了一个番茄钟',
            tomato.title
          );
        },
        1000 * 60 * countdown,
        userid
      );
      TIME_OUT_PAIRS[userid + ':TIME_OUT_ID'] = TIME_OUT_ID;
      this.notify(userid, 'other_end_start_tomato', tomato);
    }

    /**
     * tomato breaked
     */
    async breakTomato() {
      const obj = this.ctx.args[0];
      const { userid, tomato } = obj;
      const redisTomatoService = app.util.redis.redisTomatoService;
      let tomato_ongoing = await redisTomatoService.findUserTomato(app, userid);
      if (!tomato_ongoing) {
        return;
      }

      tomato_ongoing = JSON.parse(tomato_ongoing);
      tomato_ongoing.endTime = new Date();
      tomato_ongoing.succeed = 0;
      tomato_ongoing.breakReason = tomato.breakReason;

      const TIME_OUT_ID = TIME_OUT_PAIRS[userid + ':TIME_OUT_ID'];
      clearTimeout(TIME_OUT_ID);
      const result = await this.service.tomato.create(tomato_ongoing);
      await redisTomatoService.deleteUserTomato(app, userid);
      if (result) {
        this.notify(userid, 'other_end_break_tomato', tomato_ongoing);
      }
    }

    /**
     * user disconnect
     */
    async disconnect() {
      const socket = this.ctx.socket;
      const redisTomatoService = app.util.redis.redisTomatoService;
      const userid = await redisTomatoService.findSocketUser(app, socket);
      this.ctx.logger.info('userid!', userid);
      if (userid) {
        await redisTomatoService.deleteUserSocket(app, userid, socket);
        await redisTomatoService.deleteSocketUser(app, socket);
        this.clearTomatoTimeout(userid);
      }
    }

    /**
     * user logout
     */
    async logout() {
      const { ctx, app } = this;
      const socket = ctx.socket;
      const redisTomatoService = app.util.redis.redisTomatoService;
      // TODO: username to userid
      const userid = await redisTomatoService.findSocketUser(app, socket);
      this.ctx.logger.info('userid!', userid);
      if (userid) {
        await redisTomatoService.deleteUserSocket(app, userid, socket);
        await redisTomatoService.deleteSocketUser(app, socket);
        this.clearTomatoTimeout(userid);
      }
    }

    /**
     * send message
     * @param {string} userid userid
     * @param {string} evtName socket.io event name
     * @param {string} message message
     */
    async notify(userid, evtName, message) {
      const loginEnds = await this.findUserSocket(userid);
      if (loginEnds && loginEnds.length > 0) {
        for (const end of loginEnds) {
          if (end) {
            await app.io
              .of('/tomatobang')
              .to(end)
              .emit(evtName, message);
          }
        }
      }
    }

    /**
     * util: find user sockets
     * @param userid user id
     */
    async findUserSocket(userid) {
      const socketList = await app.util.redis.redisTomatoService.findUserSocket(
        app,
        userid
      );
      return socketList;
    }

    clearTomatoTimeout(userid) {
      let TIME_OUT_ID = TIME_OUT_PAIRS[userid + ':TIME_OUT_ID'];
      if (TIME_OUT_ID) {
        clearTimeout(TIME_OUT_ID);
      }
    }
  }
  return TBController;
};
