'use strict';

import BaseService from './base';
export default class TodoRecordService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.TodoRegular;
    }
}
