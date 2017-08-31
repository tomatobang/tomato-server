"use strict";

let models = require("../model/mongo");

// let rongyunUtil = require("../utils/rongyun");
let rongyunUtil = require("../utils/rongyun_co");


module.exports.init = function (router) {
	/**
	 * 邮箱验证 
	 */
	router.post("/email_username/verify", async function (ctx, next) {
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

	/**
	 * 今日番茄钟
	 */
	router.get("/filter/tomatotoday", async function (ctx, next) {
		let tomatomodel = models.tomato;
		let datenow = new Date();
		let date =
			datenow.getFullYear() +
			"-" +
			(datenow.getMonth() + 1) +
			"-" +
			datenow.getDate(); // ,"$lte":new Date()
		// 按用户筛选
		let conditions = { startTime: { $gte: new Date(date).toISOString() } };
		if (ctx.request.currentUser) {
			conditions.userid = ctx.request.currentUser.username;
		} else {
			ctx.status = 200;
			ctx.body = [];
		}

		let ret = await tomatomodel.find(conditions).exec();
		if (ret.length) {
			ctx.status = 200;
			ctx.body = ret;
		} else {
			ctx.status = 200;
			ctx.body = [];
		}
	});

	/**
	 * 解散群组
	 */
	router.post("/tool/dismissgroup", async function (ctx, next) {
		console.log("/tool/dismissgroup");
		let userid = ctx.request.body.userid;
		let groupid = ctx.request.body.groupid;
		if (!userid || !groupid) {
			ctx.status = 500;
			ctx.body = {
				success: false,
				msg: "userid与groupid 必填！"
			};
			return;
		}
		console.log("userid", userid);
		console.log("groupid", groupid);
		let ret = await rongyunUtil.dissmissgroup(userid, groupid);
		console.log("ret", ret);
		if (ret) {
			ctx.status = 200;
			ctx.body = {
				success: true,
				msg: "删除成功"
			};
		} else {
			ctx.status = 500;
			ctx.body = {
				success: false,
				msg: "删除失败"
			};
		}
	});

	/**
	 * 上传音频
	 */
	const formidable = require("formidable");
	const fs = require('fs');
	const os = require('os');
	const path = require('path');
	//const baseUrl = "http://115.29.51.196:5555";
	router.post("/upload/voicefile",async function (ctx, next) {
		var form = new formidable.IncomingForm();
		await form.parse(ctx.req, async function (err, fields, files) {
			const taskid = fields.taskid;
			const userid = fields.userid;
			if (!taskid || !userid){
				throw new Error("taskid或userid为空！");
				return;
			}
			if (err) { throw err; return; }
			let file = files.files;
			if (!file){ // 兼容 ionic file transfer 插件
				file = files.file;
			}
			const reader = fs.createReadStream(file.path);
			// 设置保存路径
			let rootDir = path.resolve(__dirname, "..");
			let relateUrl = "/uploadfile/voices/" + (userid+"_"+taskid+"_"+file.name);
			let savePath = rootDir + relateUrl;
			// path.join(os.tmpdir()
			const stream = fs.createWriteStream(savePath, {
				flags: 'w',
				defaultEncoding: 'utf8',
				fd: null,
				mode: 0o666,
				autoClose: true
			});
			reader.pipe(stream);
			console.log('uploading %s -> %s', file.name, stream.path);
			let taskmodel = models.task;
			await taskmodel.updateOne({_id:taskid}, {voiceUrl:relateUrl}, {});
		});

		ctx.status = 200;
		ctx.body = {
			success: true,
			msg: "上传成功"
		};
	})
};
