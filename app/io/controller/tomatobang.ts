'use strict';

/**
 * TODO:
 * 错误处理
 */

const TIME_OUT_PAIRS = {};
import { Application, Controller } from 'egg';
module.exports = (app: Application) => {
  /**
   * 消息订阅测试
   */
  app.redis.on('message', (channel, message) => {
    console.log('Receive message %s from channel %s', message, channel);
  });

  class TBController extends Controller {
    /**
     * 加载已有番茄钟
     */
    async loadTomato() {
      const obj = this.ctx.args[0];
      const socket = this.ctx.socket;
      const { userid } = obj;

      const tomato = await app.redis.get(userid + ':tomato');
      // 需要事先移除关联的用户, 用户切换时有必要
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
     * 开启番茄钟
     */
    async startTomato() {
      const obj = this.ctx.args[0];
      const socket = this.ctx.socket;
      this.ctx.logger.info('start_tomato', obj);
      const { userid, tomato, countdown } = obj;
      tomato.startTime = new Date();

      // 添加过期处理机制, 过期后自动清空, 10s 用来确保番茄钟被保存
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
     * 中断番茄钟
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
      this.ctx.logger.info('创建一个TOMATO: UNFINISHED!');
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
  }
  return TBController;
};
