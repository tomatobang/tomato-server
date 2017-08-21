// 缓存 {id:{name:////}}
let cahce = {};

// 登录则建立连接，初始化 cache

// 创建:则插入cache，并推送至另一端

// 中断:插入数据库

// 结束:插入数据库

// 断开连接，则删除cache

let dataModels = require("./model/mongo.js");
let tomatomodel = dataModels.tomatomodel;
let toamato_hash = {};
/**
 * 视频聊天中转服务器
*/
module.exports = io => {
	io.of("/tomato").on("connection", socket => {
		/**
         * 加载已有番茄钟
         */
		socket.on("load_tomato", (userid, endname) => {
            let hash = toamato_hash[userid];
            if (hash && hash.tomato){
                io
                .of("/tomato")
                .to(socket.id)
                .emit("load_tomato_succeed", hash.tomato);
            }
        });

		/**
         * 开始
         */
		socket.on("start_tomato", (userid, endname, tomato) => {
			let hash = toamato_hash[userid];
			hash.end = endname;
			let socketList = hash.socketList;
			hash.tomato = tomato;
			for (let so of socketList) {
				if (so != socket.id) {
					io
						.of("/tomato")
						.to(so)
						.emit("other_end_start_tomato", tomato);
				}
			}
		});

		/**
         * 番茄钟中断
         */
		socket.on("break_tomato", async (userid, endname, tomato) => {
			let hash = toamato_hash[userid];
			hash.end = endname;
			let socketList = hash.socketList;
			hash.tomato = tomato;

			// 保存当前番茄钟
			const result = await model.create(tomato);
			if (result) {
				for (let so of socketList) {
					if (so != socket.id) {
						io
							.of("/tomato")
							.to(so)
							.emit("other_end_break_tomato", tomato);
					}
				}
			}
		});

		/**
         * 番茄钟完成
         */
		// socket.on("finish", (userid, tomato) => {

        // });

		/**
		 * 离线处理
		 */
		socket.on("disconnect", () => {
			let hash = toamato_hash[userid];
			let socketList = hash.socketList;
			if (result) {
				var index = socketList.indexOf(socket.id);
                if (index > -1) {
                    socketList.splice(index, 1);
                }
			}
		});
	});
};
