const config = require("../conf/config");
const mongoose = require("mongoose");
const log = require("../utils/log");

// 融云
const rongcloudSDK = require("rongcloud-sdk");
rongcloudSDK.init(config.rongyun_key, config.rongyun_secret);

mongoose.Promise = require("bluebird");

const mongoUrl = `${config.mongoHost}:${config.mongoPort}/${config.mongoDatabase}`;

mongoose.connect(mongoUrl);

let db = mongoose.connection;

db.on("error", err => {
	log.error("connect error:", err);
});

db.once("open", () => {
	log.info("MongoDB is ready");
});

const Schema = mongoose.Schema;

/**
 * 任务
 */
let task = new Schema({
	// 用户编号
	userid: String,
	// 标题
	title: String,
	// 目标
	target: String,
	// 描述
	description: { type: String, default: "" },
	// 番茄个数
	num: { type: Number, default: 0 },
	// 是否激活
	isActive: { type: Boolean, default: false }
});

/**
 * 番茄钟
 */
let tomato = new Schema({
	// 用户编号
	userid: { type: String, default: "" },
	// 开始时间
	startTime: { type: String, default: "" },
	// 结束时间
	endTime: { type: String, default: "" },
	// 标题
	title: { type: String, default: "" },
	// 目标
	target: String,
	// 描述
	description: { type: String, default: "" },
	// 任务编号，可空
	taskid: { type: String, default: "" },
	// 是否成功 1:成功 0:失败
	succeed: { type: Number, default: 1 },
	// 中断原因
	breakReason: { type: String, default: "" }
});

/**
 * 用户
 */
let user = new Schema({
	// 用户名
	username: String,
	// 密码
	password: String,
	// 显示名称
	displayName: String,
	// 邮箱
	email: String,
	// 融云 token
	rongyun_token: String
});

// 融云toke
user.statics.getRongyunToken = (userid, username, headImg, cb) => {
	let that = this;
	that.find({ _id: userid }, (err, user) => {
		console.log("当前用户:", user);
		if (!user || user.length == 0) {
		} else {
			if (!user.rongyun_token) {
				rongcloudSDK.user.getToken(
					user._id,
					user.username,
					headImg,
					(err, reponse) => {
						if (err) {
							cb("获取融云token err:" + err, null);
						} else {
							let result = JSON.parse(reponse);
							if (result.code === 200) {
								console.log(
									"获取融云token suceess:" + result.token
								);
								let conditions = { _id: userid },
									update = {
										$set: { rongyun_token: result.token }
									};
								updateUser(conditions, update, {});
							}
						}
					}
				);
			} else {
				// 用户名有更改
				if (username != user[0].username) {
					rongcloudSDK.user.refresh(
						userid,
						username,
						user[0].headimg,
						"json",
						() => {
							let conditions = { _id: userid },
								update = { $set: { username: username } };
							updateUser(conditions, update, {});
						}
					);
				}
			}
			cb(null, user[0]);
		}
	});

	function updateUser(conditions, update, option) {
		that.update(conditions, update, options, function(err, docs) {
			if (err) {
				console.log("update user err:" + err);
			} else {
				console.log("update user suc:" + docs.username);
			}
		});
	}
};

/**
 * 网站说明
 */
let option = new Schema({
	// 键
	key: String,
	// 值
	value: Schema.Types.Mixed,
	// 描述
	desc: String
});

taskmodel = mongoose.model("task", task);
tomatomodel = mongoose.model("tomato", tomato);
usermodel = mongoose.model("user", user);
optionmodel = mongoose.model("option", option);

module.exports = {
	task:taskmodel,
	tomato:tomatomodel,
	user:usermodel,
	option:optionmodel
};
