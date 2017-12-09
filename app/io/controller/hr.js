'use strict';

const util = require("util");
let currentState = "";
module.exports = app => {
    class Controller extends app.Controller {
        /**
         * 大屏上线
         */
        async bigSreenOnline() {
            const obj = this.ctx.args[0];
            let socket = this.ctx.socket;
            await app.redis.set('big:screen', socket.id);
        }

        /**
         * 控制端初始化时加载大屏状态
         */
        async loadBigScreenState() {
            const obj = this.ctx.args[0];
            let socket = this.ctx.socket;
            let bigScreen = await app.redis.get("big:screen");
            await app.io
                .of("/hr")
                .to(socket.id)
                .emit("receive_big_screen_state", {
                    isOnline: bigScreen ? true : false
                });
        }


        /**
         * 下发控制指令
         */
        async uploadCommad() {
            const obj = this.ctx.args[0];
            let socket = this.ctx.socket;
            let { command } = obj;
            console.log('obj',obj);
            let bigScreen = await app.redis.get("big:screen");
            if (bigScreen) {
                await app.io
                    .of("/hr")
                    .to(bigScreen)
                    .emit("receive_commad", command);
            } else {
                await app.io
                    .of("/hr")
                    .to(socket.id)
                    .emit("bigScreenOffline", {});
            }
        }
    }
    return Controller
};
