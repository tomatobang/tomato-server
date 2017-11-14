module.exports = app => {
    class OptionsController extends app.Controller {
        /**
         * 按条件查找
         */
        async list() {
            const { ctx } = this;
            let conditions = {};
            let select = {};
            let query = ctx.request.query;
            if (query.conditions) {
                conditions = JSON.parse(query.conditions);
            }
            const result = await ctx.service.options.findAll(query, conditions);
            
            ctx.logger.info("options", result);

            // 设置响应体和状态码
            ctx.body = result;
            ctx.status = 200;
        }
    }
    return OptionsController;
};