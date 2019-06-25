'use strict';
import BaseController from './base';

import { assetValidationRule } from '../validate/asset';

export default class AssetController extends BaseController {
    constructor(ctx) {
        super(ctx);
        this.service = ctx.service.asset;
        this.validateRule = assetValidationRule;
    }

    /**
* search with conditions
*/
    async list() {
        const { ctx } = this;
        let conditions: any;
        conditions = {};
        const query = ctx.request.query;
        conditions.userid = ctx.request['currentUser']._id;
        ctx.logger.info('ctx.request：', ctx.request['currentUser']);
        if (query.conditions) {
            conditions = JSON.parse(query.conditions);
        }
        const result = await this.service.findAll(query, conditions);
        ctx.body = result;
        ctx.status = 200;
    }

    /**
    * create record
    */
    async create() {
        const { ctx, app } = this;
        // filter with logged userinfo
        ctx.request.body.userid = ctx.request['currentUser']._id;
        if (this.validateRule) {
            const invalid = app['validator'].validate(
                this.validateRule,
                ctx.request.body
            );
            if (invalid) {
                ctx.throw(400);
            }
        }
        const result = await this.service.create(ctx.request.body);
        ctx.status = 200;
        ctx.body = result;
    }
}
