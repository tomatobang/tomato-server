'use strict';

import BaseService from './base';
export default class TodoService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Todo;
    }
}
