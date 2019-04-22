'use strict';

import BaseService from './base';
export default class TodoRegularService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.TodoRegular;
    }
}
