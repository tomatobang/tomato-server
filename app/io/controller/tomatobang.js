'use strict';

const util = require("util");
let toamato_hash = {};
let socket_hash = {};
// defined as class methods
module.exports = app => {
  class Controller extends app.Controller {
    /**
     * 加载已有番茄钟
     */
    async loadTomato() {
      // console.info('toamato_hash', toamato_hash);
      // console.info('this.ctx', this.ctx);
      // console.info('this.ctx.args', this.ctx.args);
      const obj = this.ctx.args[0];
      let socket = this.ctx.socket;
      let { userid, endname, tomato } = obj;
      let hash = toamato_hash[userid];
      if (hash && hash.tomato) {
        await app.io
          .of("/tomatobang")
          .to(socket.id)
          .emit("load_tomato_succeed", hash.tomato);
      } else {
        toamato_hash[userid] = {};
        toamato_hash[userid].socketList = [socket.id]
        socket_hash[socket.id] = userid;
        await app.io
          .of("/tomatobang")
          .to(socket.id)
          .emit("load_tomato_succeed", null);
      }
    }

    async startTomato() {
      const obj = this.ctx.args[0];
      let socket = this.ctx.socket;
      console.log('start_tomato', obj);
      // conundown 可以自己指定
      let { userid, endname, tomato, countdown } = obj;
      let hash = toamato_hash[userid];
      if (!hash) {
        hash = {};
      }
      hash.end = endname;
      let socketList = hash.socketList ? hash.socketList : [];
      tomato.startTime = new Date();
      hash.tomato = tomato;
      if (hash.TIME_OUT_ID) {
        clearTimeout(hash.TIME_OUT_ID);
      }
      let TIME_OUT_ID = setTimeout(
        async userid => {
          let thash = toamato_hash[userid];
          let tomato = thash.tomato;
          tomato.endTime = new Date();
          tomato.succeed = 1;
          await this.service.tomato.create(tomato);
          thash.tomato = null;
          // 服务端通知刷新番茄钟列表
          for (let so of socketList) {
            await app.io
              .of("/tomatobang")
              .to(so)
              .emit("new_tomate_added", tomato);
          }
          this.helper.pushMessage(userid, "你完成了一个番茄钟", tomato.title);
        },
        1000 * 60 * countdown,
        userid
      );
      hash.TIME_OUT_ID = TIME_OUT_ID;
      for (let so of socketList) {
        if (so != socket.id) {
          await app.io
            .of("/tomatobang")
            .to(so)
            .emit("other_end_start_tomato", tomato);
        }
      }
    }

    async breakTomato() {
      const obj = this.ctx.args[0];
      let socket = this.ctx.socket;
      let { userid, endname, tomato } = obj;
      let hash = toamato_hash[userid];
      if (!hash) {
        return;
      }
      hash.end = endname;
      let socketList = hash.socketList;
      let _tomato = hash.tomato;
      _tomato.endTime = new Date();
      _tomato.succeed = 0;
      _tomato.breakReason = tomato.breakReason;
      clearTimeout(hash.TIME_OUT_ID);
      const result = await this.service.tomato.create(_tomato);
      console.log("创建一个TOMATO!");
      hash.tomato = null;
      console.log(result, socketList)
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

    async disconnect() {
      let socket = this.ctx.socket;
      let userid = socket_hash[socket.id];
      let hash = toamato_hash[userid];
      if (hash) {
        let socketList = hash.socketList;
        if (socketList) {
          let index = socketList.indexOf(socket.id);
          if (index > -1) {
            socketList.splice(index, 1);
          }
        }
      }
    }
  }
  return Controller
};
