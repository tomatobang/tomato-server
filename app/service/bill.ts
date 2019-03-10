'use strict';

import BaseService from './base';
export default class BillService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Bill;
    }

    /**
     * 获取账单列表
     * @param { String } conditions 条件
     */
    async getBillList(conditions) {
        const result = await this.model
            .find(conditions)
            .populate({ path: 'asset', select: 'name' })
            .sort('-create_at')
            .select('_id create_at note asset tag amount type');

        return result;
    }
}
