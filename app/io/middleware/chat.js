'use strict';

module.exports = (app) => {
  return  function* (next) {

    let socket = this.socket;
    let user_hash = {};
    let socket_hash = {};
    socket.on("login_test", function (userid, username, headImg) {
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

		/**
		 * 离线处理
		 */
    socket.on("disconnect", function () {
      let userid = socket_hash[socket.id];
      if (userid) {
        socket.broadcast.emit("offline", userid);
        console.log(userid + " 失联了！");
        delete socket_hash[socket.id];
        delete user_hash[userid];
      }
    });


		/**
		 * 检查用户状态
		 */
    socket.on("checkOnline", function (userids) {
      let useridLen = userids.length;
      let ret = []; posReceived
      for (i = 0; i < useridLen; i++) {
        if (user_hash[userids[i]]) {
          ret.push({ id: userids[i], state: 1 });
        }
      }
      socket.emit("checkOnline_suc", ret);
    });

		/**
		 * 发送与接收消息
		 */
    socket.emit("msg", { msg: "Welcome bro!" });
    socket.on("msg", function (msg) {
      socket.emit("msg", { msg: "you sent : " + msg });
    });

		/**
		 * 请求他人位置
		 */
    socket.on("request_other_pos", function (to_userid, pos) {
      // console.log("send pos to:" + to_userid);
      let send_userid = socket_hash[socket.id];
      if (!send_userid) {
        socket.emit("location_error", "请先登录再发消息！");
        return false;
      }
      let contact = user_hash[to_userid];
      // console.log("contact:" + JSON.stringify(contact));
      if (!contact) {
        socket.emit("location_error", "对方不在线！");
        return;
      }
      // console.log("send pos to(finded):" + to_userid + " from:" + send_userid);
      app.io
        .of("/tomatobang")
        .to(user_hash[to_userid])
        .emit("please_post_pos", { send_userid });
    });

		/**
		 * 提交自身位置
		 */
    socket.on("post_my_pos", function (to_userid, pos) {
      // console.log("send pos to:" + to_userid);
      let send_userid = socket_hash[socket.id];
      if (!send_userid) {
        socket.emit("location_error", "请先登录再发消息！");
        return false;
      }
      let contact = user_hash[to_userid];
      // console.log("contact:" + JSON.stringify(contact));
      if (!contact) {
        socket.emit("location_error", "对方不在线！");
        return;
      }
      // console.log("post pos to(finded):" + to_userid + " from:" + send_userid);
      app.io
        .of("/tomatobang")
        .to(user_hash[to_userid])
        .emit("received_other_pos", { send_userid, pos });
    });


		/**
		 * 视频/音频消息中转服务
		 */
    socket.on("sendMessage", function (to_userid, message) {
      console.log("send message to:" + to_userid);
      let send_userid = socket_hash[socket.id];
      if (!currentUser) {
        socket.emit("sendMessage_error", "请先登录再发消息！");
        return false;
      }

      let contact = user_hash[to_userid];
      console.log("contact:" + JSON.stringify(contact));
      if (!contact) {
        socket.emit("sendMessage_error", "对方不在线！");
        return;
      }
      console.log(
        "send message to(finded):" + to_userid + " from:" + send_userid
      );

      app.io
        .of("/tomatobang")
        .to(contact.socket)
        .emit("messageReceived", currentUser.send_userid, message);
    });
    yield* next;
    console.log('packet response!');
  };
};
