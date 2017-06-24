"use strict";

let models = require("../model/mongo");

module.exports.init = function(router) {
  /**
   * 邮箱验证
  */
  router.post("/email/verify", async function(ctx, next) {
    let usermodel = models.user;
    let email = ctx.request.body.email;
    let emailRet = await usermodel.find({ email: email }).exec();
    if (emailRet.length) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: "邮箱已存在！"
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
