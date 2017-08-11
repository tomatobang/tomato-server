let dataModels = require("./model/mongo.js");
let userModel = dataModels.user;
let user_hash = {};
let socket_hash = {};
/**
 * 视频聊天中转服务器
*/
module.exports = io => {
	io.of("/chat").on("connection", function(socket) {
		// socket.on("login", function(userid, username, headImg) {
		// 	if (user_hash[userid]) {
		// 		console.log(userid + " 在其他地方登陆！");
		// 		delete user_hash[userid];
		// 	}
		// 	/**
		//      * userid
		//      * username
		//      * headImg
		//      * callback
		//      */
		// 	userModel.getRongyunToken(userid, username, "", callback);
		// 	function callback(err, info) {
		// 		if (err) {
		// 			socket.emit("login_error", err);
		// 		} else {
		// 			user_hash[userid] = socket.id;
		// 			socket_hash[socket.id] = userid;
		// 			socket.emit("login_successful", info);
		// 			socket.broadcast.emit("online", info.userid);
		// 			console.log(info.userid + " logged in");
		// 		}
		// 	}
		// });

		socket.on("login_test", function(userid, username, headImg) {
			if (user_hash[userid]) {
				console.log(userid + " 在其他地方登陆！");
				delete user_hash[userid];
			}
			/**
             * userid
             * headImg
             * callback
             */
			user_hash[userid] = socket.id;
			socket_hash[socket.id] = userid;
			socket.emit("login_successful", userid);
			socket.broadcast.emit("online", userid);
			console.log(userid + " logged in");
		});

		// 视频/音频消息中转服务
		socket.on("sendMessage", function(to_userid, message) {
			console.log("send message to:" + to_userid);
			var send_userid = socket_hash[socket.id];
			if (!currentUser) {
				socket.emit("sendMessage_error", "请先登录再发消息！");
				return false;
			}

			var contact = user_hash[to_userid];
			console.log("contact:" + JSON.stringify(contact));
			if (!contact) {
				socket.emit("sendMessage_error", "对方不在线！");
				return;
			}
			console.log(
				"send message to(finded):" + to_userid + " from:" + send_userid
			);

			io
				.of("/chat")
				.to(contact.socket)
				.emit("messageReceived", currentUser.send_userid, message);
		});

		// 离线处理
		socket.on("disconnect", function() {
			userid = socket_hash[socket.id];
			if (userid) {
				socket.broadcast.emit("offline", userid);
				console.log(userid + " 失联了！");
				delete socket_hash[socket.id];
				delete user_hash[userid];
			}
		});

		// 创建/查找 群组
		// socket.on("findGroup", function(groupid, groupname, userids, headImg) {
		// 	chatGroup.findGroup(groupid, groupname, userids, headImg, callback);
		// 	function callback(err, ret) {
		// 		if (err) {
		// 			socket.emit("findGroup_err", err);
		// 		} else {
		// 			socket.emit("findGroup_successful", ret);
		// 		}
		// 	}
		// });

		// 检查用户在线状态(官方接口只能检查单个)
		socket.on("checkOnline", function(userids) {
			var useridLen = userids.length;
			var ret = [];posReceived
			for (i = 0; i < useridLen; i++) {
				if (user_hash[userids[i]]) {
					ret.push({ id: userids[i], state: 1 });
				}
			}
			socket.emit("checkOnline_suc", ret);
		});

		socket.emit("msg", { msg: "Welcome bro!" });
		socket.on("msg", function(msg) {
			socket.emit("msg", { msg: "you sent : " + msg });
		});

		socket.on("request_pos", function(to_userid, pos) {
			console.log("send pos to:" + to_userid);
			var send_userid = socket_hash[socket.id];
			if (!send_userid) {
				socket.emit("sendPos_error", "请先登录再发消息！");
				return false;
			}
			var contact = user_hash[to_userid];
			console.log("contact:" + JSON.stringify(contact));
			if (!contact) {
				socket.emit("sendPos_error", "对方不在线！");
				return;
			}
			console.log(
				"send pos to(finded):" + to_userid + " from:" + send_userid
			);
			io
				.of("/chat")
				.to(user_hash[to_userid])
				.emit("submit_pos", {send_userid});
		});

		socket.on("post_pos", function(to_userid,pos) {
			console.log("send pos to:" + to_userid);
			var send_userid = socket_hash[socket.id];
			if (!send_userid) {
				socket.emit("post_pos", "请先登录再发消息！");
				return false;
			}
			var contact = user_hash[to_userid];
			console.log("contact:" + JSON.stringify(contact));
			if (!contact) {
				socket.emit("post_pos", "对方不在线！");
				return;
			}
			console.log(
				"post pos to(finded):" + to_userid + " from:" + send_userid
			);
			io
				.of("/chat")
				.to(user_hash[to_userid])
				.emit("posReceived", {send_userid, pos });
		});
	});
};