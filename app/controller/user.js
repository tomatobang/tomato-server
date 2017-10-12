// app/controller/news.js
module.exports = app => {
    class UserController extends app.Controller {

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