'use strict';

const util = require("util");
let TIME_OUT_PAIRS = {};
module.exports = app => {
  app.redis.on('message', function (channel, message) {
    console.log('Receive message %s from channel %s', message, channel);
  });


  class Controller extends app.Controller {
    /**
     * 加载已有番茄钟
     */
    async loadTomato() {
      const obj = this.ctx.args[0];
      let socket = this.ctx.socket;
      let { userid, endname } = obj;
      let tomato = await app.redis.get(userid + ":tomato");
      // 需要事先移除关联的用户（用户切换时有必要）
      let old_userid = await app.redis.get(socket.id);
      await app.redis.srem(old_userid + ":socket", socket.id);
      await app.redis.sadd(userid + ":socket", socket.id);
      await app.redis.set(socket.id, userid);

      if (tomato) {
        console.log('send load tomato',tomato);
        await app.io
          .of("/tomatobang")
          .to(socket.id)
          .emit("load_tomato_succeed", JSON.parse(tomato));
      } else {
        await app.io
          .of("/tomatobang")
          .to(socket.id)
          .emit("load_tomato_succeed", null);
      }
    }

    /**
     * 开启番茄钟
     */
    async startTomato() {
      const obj = this.ctx.args[0];
      let socket = this.ctx.socket;
      this.ctx.logger.info('start_tomato', obj);
      // conundown 长度由客户端指定
      let { userid, endname, tomato, countdown } = obj;
      tomato.startTime = new Date();
      // 需要添加过期处理机制，否则会失效
      await app.redis.set(userid + ":tomato", JSON.stringify(tomato), 'EX', countdown * 60 + 10);
      let TIME_OUT_ID = TIME_OUT_PAIRS[userid + ":TIME_OUT_ID"];
      if (TIME_OUT_ID) {
        clearTimeout(TIME_OUT_ID);
      }
      TIME_OUT_ID = setTimeout(
        async userid => {
          let tomato = await app.redis.get(userid + ":tomato");
          if (tomato) {
            tomato = JSON.parse(tomato);
          }
          tomato.endTime = new Date();
          tomato.succeed = 1;
          await this.service.tomato.create(tomato);
          await app.redis.del(userid + ":tomato");
          // 服务端推送消息
          let socketList = await app.redis.smembers(userid + ":socket");
          for (let so of socketList) {
            await app.io
              .of("/tomatobang")
              .to(so)
              .emit("new_tomate_added", tomato);
          }
          this.ctx.helper.pushMessage(userid, "你完成了一个番茄钟", tomato.title);
        },
        1000 * 60 * countdown,
        userid
      );
      TIME_OUT_PAIRS[userid + ":TIME_OUT_ID"] = TIME_OUT_ID;
      let socketList = await app.redis.smembers(userid + ":socket");
      for (let so of socketList) {
        if (so != socket.id) {
          await app.io
            .of("/tomatobang")
            .to(so)
            .emit("other_end_start_tomato", tomato);
        }
      }
    }

    /**
     * 中断番茄钟
     */
    async breakTomato() {
      const obj = this.ctx.args[0];
      let socket = this.ctx.socket;
      let { userid, endname, tomato } = obj;
      let r_tomato = await app.redis.get(userid + ":tomato");
      if (!r_tomato) {
        return;
      } else {
        r_tomato = JSON.parse(r_tomato);
      }
      let socketList = await app.redis.smembers(userid + ":socket");
      let _tomato = r_tomato;
      _tomato.endTime = new Date();
      _tomato.succeed = 0;
      _tomato.breakReason = tomato.breakReason;
      let TIME_OUT_ID = TIME_OUT_PAIRS[userid + ":TIME_OUT_ID"];
      clearTimeout(TIME_OUT_ID);
      const result = await this.service.tomato.create(_tomato);
      this.ctx.logger.info("创建一个TOMATO!");
      await app.redis.del(userid + ":tomato")
      if (result) {
        for (let so of socketList) {
          if (so != socket.id) {
            await app.io
              .of("/tomatobang")
              .to(so)
              .emit("other_end_break_tomato", _tomato);
          }
        }
      }
    }

    /**
     * 连接中断（迁移至中间件 auth）
     */
    // async disconnect() {
    //   let socket = this.ctx.socket;
    //   let userid = await app.redis.get(socket.id);
    //   let count = await app.redis.scard(userid + ":socket")
    //   if (count > 0) {
    //     await app.redis.srem(userid + ":socket", socket.id);
    //     await app.redis.del(socket.id);
    //   }
    // }
  }
  return Controller
};
