'use strict';

import BaseService from './base';
export default class AssetService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Asset;
    }
}
