'use strict';

const BaseController = require('./base');
class TomatoController extends BaseController {
    constructor(ctx) {
        super(ctx);
        this.service = ctx.service.tomato;
    }

    async statistics() {
        const { ctx } = this;
        const isSuccess = ctx.request.body.isSuccess;
        const date = ctx.request.body.date;
        // 按用户筛选
        let userid = '';
        if (ctx.request.currentUser) {
            userid = ctx.request.currentUser.username;
        } else {
            ctx.status = 200;
            ctx.body = [];
        }
        // 获取本月的第一天
        const starDate = ctx.helper.dateHelper.getCurrentMonthFirst(date);
        // 获取本月的最后一天
        const endDate = ctx.helper.dateHelper.getNextMonthFirst(date);
        const ret = await ctx.service.tomato.statistics(userid, starDate, endDate, isSuccess);
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
        const datenow = new Date();
        const date =
            datenow.getFullYear() +
            '-' +
            (datenow.getMonth() + 1) +
            '-' +
            datenow.getDate(); // ,'$lte':new Date()
        // 按用户筛选
        const conditions = { startTime: { $gte: new Date(date).toISOString() } };
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
        ctx.logger.info('keywords2', keywords);
        const ret = await ctx.service.tomato.findAll({}, {
            title: { $regex: keywords, $options: 'i' },
        });
        ctx.status = 200;
        ctx.body = ret;

    }
}
module.exports = TomatoController;
