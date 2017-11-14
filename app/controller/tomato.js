module.exports = app => {
    class TomatoController extends app.Controller {
        async statistics() {
            const { ctx } = this;
            let isSuccess = ctx.request.body.isSuccess;
            let date = ctx.request.body.date;
            // 按用户筛选
            let userid = "";
            if (ctx.request.currentUser) {
                userid = ctx.request.currentUser.username;
            } else {
                ctx.status = 200;
                ctx.body = [];
            }
            // 获取本月的第一天
            let starDate = ctx.helper.dateHelper.getCurrentMonthFirst(date);
            // 获取本月的最后一天
            let endDte = ctx.helper.dateHelper.getCurrentMonthLast(date);
            const ret = await ctx.service.tomato.statistics(userid, starDate, endDte, isSuccess);
            if (ret.length) {
                ctx.status = 200;
                ctx.body = ret;
            } else {
                ctx.status = 200;
                ctx.body = [];
            }
        }

        /**
         * 筛选今日番茄钟
         */
        async tomatoToday() {
            const { ctx } = this;
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
            const ret = await ctx.service.tomato.findAll({}, conditions);
            if (ret.length) {
                ctx.status = 200;
                ctx.body = ret;
            } else {
                ctx.status = 200;
                ctx.body = [];
            }
        }

        /**
         * 关键词查找
         */

        async search() {
            const { ctx } = this;
            // 对这些关键字得做处理
            let keywords = ctx.request.body.keywords;
            keywords = ctx.helper.escape(keywords);
            ctx.logger.info('keywords2', keywords)
            const ret = await ctx.service.tomato.findAll({}, {
                title: { $regex: keywords, $options: 'i' }

            });
            ctx.status = 200;
            ctx.body = ret;

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
            const result = await ctx.service.tomato.findAll(query, conditions);
            //ctx.logger.info("tomato", result);

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
            const users = await ctx.service.tomato.findById(query, id);
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
            const result = await ctx.service.tomato.create(ctx.request.body);
            ctx.status = 201;
            ctx.body = result;
        }

        /**
         * 删除
         */
        async deleteById() {
            const { ctx } = this;
            let id = ctx.params.id;
            const result = await ctx.service.tomato.delete(id);
            ctx.body = result;
        }

        /**
         * 按 id 更新
         */
        async updateById() {
            const { ctx } = this;
            let id = ctx.params.id;
            let body = ctx.request.body;
            const result = await ctx.service.tomato.updateById(id, body);
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
            const result = await ctx.service.tomato.replaceById(id, newDocument);
            ctx.body = result;
        }

    }
    return TomatoController;
};