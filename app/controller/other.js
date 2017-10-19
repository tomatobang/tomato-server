module.exports = app => {
    class OtherController extends app.Controller {
        /**
         * 解散群组
        */
        async dismissgroup() {
            const { ctx } = this;
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
            let ret = await app.hepler.rongyunUtil.dissmissgroup(userid, groupid);
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
        }

        /**
         * 上传音频文件
         */
        async uploadVoiceFile() {
            const { ctx } = this;
            const formidable = require("formidable");
            const fs = require('fs');
            const os = require('os');
            const path = require('path');

            var form = new formidable.IncomingForm();
            await form.parse(ctx.req, async function (err, fields, files) {
                const taskid = fields.taskid;
                const userid = fields.userid;
                if (!taskid || !userid) {
                    throw new Error("taskid或userid为空！");
                    return;
                }
                if (err) { throw err; return; }
                let file = files.files;
                console.log(files.name);
                if (!file) { // 兼容 ionic file transfer 插件
                    file = files.file;
                }
                if (!file) { // egg 做了定制？
                    file = files.name;
                }
                const reader = fs.createReadStream(file.path);
                // 设置保存路径
                let rootDir = path.resolve(__dirname, "../../");
                let relateUrl = "/uploadfile/voices/" + (userid + "_" + taskid + "_" + file.name);
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
                await ctx.service.task.updateVoiceUrl(taskid, relateUrl);
            });

            ctx.status = 200;
            ctx.body = {
                success: true,
                msg: "上传成功"
            };
        }


        /**
         * 下载音频文件
         * 通过 query 参数获取相关内容
         */
        async downloadVoiceFile() {
            const { ctx } = this;
            const send = require('koa-send');
            if (!ctx.request.currentUser) {
                ctx.status = 500;
                ctx.body = "请先登录!!!";
                return;
            }
            let relateUrl = ctx.params.path;
            let savePath = "/uploadfile/voices/" + relateUrl;
            // 默认会加上本服务器地址
            await send(ctx, savePath);
        }

        
    }
    return OtherController;
};