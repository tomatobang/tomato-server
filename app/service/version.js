'use strict';
const Service = require('egg').Service;
class VersionService extends Service {

    async findLatestVersion() {
        const model = this.ctx.model.Version;
        const builder = model.find({});
        builder.sort({ datetime: -1 });
        builder.limit(1);
        const result = await builder.exec();
        return result;
    }

}
module.exports = VersionService;
