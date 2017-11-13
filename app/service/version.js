module.exports = app => {
    class VersionService extends app.Service {

        async findLatestVersion() {
            let model = this.ctx.model.Version;
            let builder = model.find({});
            builder['sort']({ datetime: -1 });
            builder['limit'](1);
            const result = await builder.exec();
            return result;
        }

    }
    return VersionService;
};