'use strict';
import BaseService from './base';
export default class VersionService extends BaseService {

    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Version;
    }

    async findLatestVersion() {
        const model = this.ctx.model.Version;
        const builder = model.find({});
        builder.sort({ datetime: -1 });
        builder.limit(1);
        const result = await builder.exec();
        return result;
    }

}
