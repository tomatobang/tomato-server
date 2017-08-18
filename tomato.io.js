// 缓存 {id:{name:////}}
let cahce = {};

// 登录则建立连接，初始化 cache

// 创建:则插入cache，并推送至另一端

// 中断:插入数据库

// 结束:插入数据库

// 断开连接，则删除cache

let dataModels = require("./model/mongo.js");
let userModel = dataModels.user;
let user_hash = {};
let socket_hash = {};
/**
 * 视频聊天中转服务器
*/
module.exports = io => {
	io.of("/tomato").on("connection", function(socket) {

        /**
         * 开始
         */
		socket.on("add_tomato", function(userid, headImg) {
            //socket.emit("msg", { msg: "you sent : " + msg });
            // 如果已有番茄钟，那么直接覆盖
		});

        /**
         * 番茄钟中断
         */
		socket.on("break_tomato", function(userid, headImg) {
        });

        /**
         * 番茄钟完成
         */
		socket.on("finish", function(userid, headImg) {});

		/**
		 * 离线处理
		 */
		socket.on("disconnect", function() {
            // 由用户离开造成的中断，且没有其它终端在线，则直接算为终端番茄钟

        });
	});
};
