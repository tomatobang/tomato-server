// 缓存 {id:{name:////}}
let cahce = {};
const util = require("util");
//const setTimeoutPromise = util.promisify(setTimeout);

let dataModels = require("./model/mongo.js");
let tomatomodel = dataModels.tomatomodel;
let toamato_hash = {};
/**
 * 视频聊天中转服务器
*/
module.exports = io => {
	io.of("/tomatobang").on("connection", socket => {
		/**
         * 加载已有番茄钟
         */
		socket.on("load_tomato", (obj) => {
			console.info('toamato_hash',toamato_hash);
			let {userid, endname, tomato} = obj;
			let hash = toamato_hash[userid];
			if (hash && hash.tomato) {
				io
					.of("/tomatobang")
					.to(socket.id)
					.emit("load_tomato_succeed", hash.tomato);
			} else {
				toamato_hash[userid] = {};
				toamato_hash[userid].socketList = [socket.id]
				io
					.of("/tomatobang")
					.to(socket.id)
					.emit("load_tomato_succeed", null);
			}
		});

		/**
         * 开始
         */
		socket.on("start_tomato", async (obj) => {
			console.log('start_tomato',obj);
			let {userid, endname, tomato} = obj;
			let hash = toamato_hash[userid];
			if (!hash){
				hash = {};
			}
			hash.end = endname;
			let socketList = hash.socketList? hash.socketList:[];
			tomato.startTime = new Date();
			hash.tomato = tomato;
			// 设定番茄钟任务：只支持 NODEJS 8
			// TIME_OUT_ID = setTimeoutPromise(1000*60*25,userid).then(async (userid) => {
			// 	let thash = toamato_hash[userid];
			// 	let tomato = thash.tomato;
			// 	tomato.endTime = new Date();
			// 	tomato.succeed = 1;
			// 	await model.create(tomato);
			// 	thash.tomato = null;
			// });

			TIME_OUT_ID = setTimeout(
				async userid => {
					let thash = toamato_hash[userid];
					let tomato = thash.tomato;
					tomato.endTime = new Date();
					tomato.succeed = 1;
					await model.create(tomato);
					thash.tomato = null;
				},
				1000 * 60 * 25,
				userid
			);

			hash.TIME_OUT_ID = TIME_OUT_ID;
			for (let so of socketList) {
				if (so != socket.id) {
					io
						.of("/tomatobang")
						.to(so)
						.emit("other_end_start_tomato", tomato);
				}
			}
		});

		/**
         * 番茄钟中断
         */
		socket.on("break_tomato", async (userid, endname) => {
			let hash = toamato_hash[userid];
			hash.end = endname;
			let socketList = hash.socketList;
			let tomato = hash.tomato;
			tomato.endTime = new Date();
			tomato.succeed = 0;
			clearTimeout(hash.TIME_OUT_ID);
			// 保存当前番茄钟
			const result = await model.create(tomato);
			if (result) {
				for (let so of socketList) {
					if (so != socket.id) {
						io
							.of("/tomatobang")
							.to(so)
							.emit("other_end_break_tomato", tomato);
					}
				}
			}
		});

		/**
		 * 离线处理
		 */
		socket.on("disconnect", () => {
			let hash = toamato_hash[userid];
			if (hash) {
				let socketList = hash.socketList;
				if (socketList) {
					var index = socketList.indexOf(socket.id);
					if (index > -1) {
						socketList.splice(index, 1);
					}
				}
			}
		});

		/**
         * 番茄钟完成
         */
		// socket.on("finish", (userid, tomato) => {
		// });
	});
};
