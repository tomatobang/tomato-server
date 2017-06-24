"use strict";

let models = require("../model/mongo");

module.exports.init = function(router) {
  /**
   * 邮箱验证
  */
  router.post("/email_username/verify", async function(ctx, next) {
    let usermodel = models.user;
    let email = ctx.request.body.email;
    let username = ctx.request.body.username;
    let emailRet = await usermodel.find({ email: email }).exec();
    let usernameRet = await usermodel.find({ username: username }).exec();
    if (emailRet.length) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: "邮箱已存在！"
      };
    } else if (usernameRet.length) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: "用户名已存在！"
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        success: true,
        msg: "邮箱可用！"
      };
    }
  });
};
