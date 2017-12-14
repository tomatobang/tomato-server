'use strict';
const BaseService = require('./base');

class OptionsService extends BaseService {

    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Option;
    }

}

module.exports = OptionsService;
