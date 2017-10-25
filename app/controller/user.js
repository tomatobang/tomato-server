// app/controller/news.js
module.exports = app => {
    class UserController extends app.Controller {
        /**
         * 登录
         */
        async login() {
            const { ctx } = this;
            let users = await ctx.service.user.findAll({}, { username: ctx.request.body.username });
            let user = {
                username: users[0].username,
                timestamp: (new Date()).valueOf()
            };
            let password = users[0].password;

            if (password === ctx.request.body.password) {
                let token = ctx.helper.tokenService.createToken(user);
                console.log(user,token);
                app.redis.set(token, JSON.stringify(user))// , 'EX', ctx.helper.tokenService.expiresIn, () => { }
                return ctx.body = {
                    status: 'success',
                    token: token,
                    userinfo:users[0]
                };
            } else {
                return ctx.body = {
                    status: 'fail',
                    description: 'Get token failed. Check the password'
                };
            }
        }

        /**
         * 登出
         */
        async logout() {
            const { ctx } = this;
            const headers = ctx.request.headers
            let token
            try {
                token = headers['authorization']
            } catch (err) {
                return ctx.body = {
                    status: 'fail',
                    description: err
                }
            }

            if (!token) {
                return ctx.body = {
                    status: 'fail',
                    description: 'Token not found'
                }
            }

            const result = ctx.helper.tokenService.verifyToken(token)

            if (result === false) {
                return ctx.body = {
                    status: 'fail',
                    description: 'Token verify failed'
                }
            } else {
                await app.redis.del('token')
                return ctx.body = {
                    status: 'success',
                    description: 'Token deleted'
                }
            }
        }
        /**
         * 获取融云token 
         */
        async getRongyunToken() {
            const { ctx } = this;
            let userid = ctx.request.body._id;
            let username = ctx.request.body.username;
            const token = await ctx.service.user.getRongyunToken(userid, username);
            ctx.status = 200;
            ctx.body = {
                success: true,
                msg: token
            };
        }

        /**
         * 邮箱验证 
         */
        async emailUserNameVerify() {
            const { ctx } = this;
            let email = ctx.request.body.email;
            let username = ctx.request.body.username;
            let {
                emailRet,
                usernameRet
            } = await ctx.service.user.emailUserNameVerify(email, username);


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
        }

        /**
         * 上传头像
         */
        async uploadHeadImg() {
            const fs = require("fs");
            const path = require('path');

            const { ctx } = this;
            const userid = ctx.request.body.userid;
            const imgData = ctx.request.body.imgData;
            console.log('上传中:' + userid);

            // 过滤data:URL
            let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
            let dataBuffer = new Buffer(base64Data, 'base64');
            let rootDir = path.resolve(__dirname, "../../");
            let relateUrl = rootDir + '/uploadfile/headimg/' + userid + '.png';

            const imgPath = relateUrl;
            console.log('上传中(path):' + imgPath);
            fs.writeFile(imgPath, dataBuffer, async (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
                await ctx.service.user.updateHeadImg(userid, userid + '.png');
            });
            ctx.status = 200;
            ctx.body = {
                success: true,
                msg: "保存成功！"
            };
        }

        /**
         * 下载头像
         * 通过 query 参数获取相关内容
         */
        async downloadHeadImg() {
            const { ctx } = this;
            const send = require('koa-send');
            if (!ctx.request.currentUser) {
                ctx.status = 500;
                ctx.body = "请先登录!!!";
                console.log("请先登录!!!");
                return;
            }
            let relateUrl = ctx.params.path;
            let savePath = "/uploadfile/headimg/" + relateUrl +".png";
            // 默认会加上本服务器地址
            console.log("发送中!!!");
            await send(ctx, savePath);
        }

        /**
         * 按条件查找
         */
        async list() {
            const { ctx } = this;
            let conditions = {};
            let select = {};
            let query = ctx.request.query;
            // 按用户筛选
            if (ctx.request.currentUser) {
                conditions.userid = ctx.request.currentUser.username;
            }
            if (query.conditions) {
                conditions = JSON.parse(query.conditions);
            }
            const result = await ctx.service.user.findAll(query, conditions);
            console.log("users", result);

            // 设置响应体和状态码
            ctx.body = result;
            ctx.status = 200;
        }

        /**
         * 按 id 查找
         */
        async findById() {
            const { ctx } = this;
            let select = {};
            let query = ctx.request.query;
            let id = ctx.params.id;
            const users = await ctx.service.user.findById(query, id);
        }

        /**
         * 创建
         */
        async create() {
            const { ctx } = this;
            // 存储用户编号/username
            if (ctx.request.currentUser) {
                ctx.request.body.userid = ctx.request.currentUser.username;
            }
            const result = await ctx.service.user.create(ctx.request.body);
            ctx.status = 201;
            ctx.body = result;
        }

        /**
         * 删除
         */
        async deleteById() {
            const { ctx } = this;
            let id = ctx.params.id;
            const result = await ctx.service.user.delete(id);
            ctx.body = result;
        }

        /**
         * 按 id 更新
         */
        async updateById() {
            const { ctx } = this;
            let id = ctx.params.id;
            let body = ctx.request.body;
            const result = await ctx.service.user.updateById(id, body);
            ctx.body = result;
        }


        /**
         * 按 id 替换
         */
        async replaceById() {
            const { ctx } = this;
            const newDocument = ctx.request.body;
            let id = ctx.params.id;
            newDocument._id = id;
            const result = await ctx.service.user.replaceById(id, newDocument);
            ctx.body = result;
        }

    }
    return UserController;
};