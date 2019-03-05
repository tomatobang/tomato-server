'use strict';

import BaseService from './base';
export default class FootprintService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Footprint;
    }
}
