"use strict";

let models = require("../model/mongo");

module.exports.init = function(router) {
  /**
   * 邮箱验证 getTodayTomatos
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

  router.get("/filter/tomatotoday", async function(ctx, next) {
    let tomatomodel = models.tomato;
    let datenow = new Date();
    let date = datenow.getFullYear() +"-" + (datenow.getMonth()+1) + "-" + datenow.getDate(); // ,"$lte":new Date()
    // 按用户筛选
    let conditions = { startTime: { $gte:new Date(date).toISOString() } };
    if (ctx.request.currentUser) {
       conditions.userid = ctx.request.currentUser.username;
    }else{
      ctx.status = 200;
      ctx.body = [];
    }
    
    let ret = await tomatomodel 
      .find(conditions) 
      .exec();
    if (ret.length) {
      ctx.status = 200;
      ctx.body = ret;
    }else{
      ctx.status = 200;
      ctx.body = [];
    }
  });
};
