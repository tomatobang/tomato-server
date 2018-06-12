'use strict';
import BaseService from './base';

export default class OptionsService extends BaseService {

    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Option;
    }

}
