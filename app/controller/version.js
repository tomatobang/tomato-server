module.exports = app => {
    class VersionController extends app.Controller {
        /**
         * 查找最新版本信息
         */
        async findLatestVersion() {
            const { ctx } = this;
            const LTSVersion = await ctx.service.version.findLatestVersion();
            ctx.status = 200;
            ctx.body = LTSVersion;
        }
    }
    return VersionController;
};