'use strict';

import BaseService from './base';
export default class BillService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Bill;
    }
}
