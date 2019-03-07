'use strict';
import BaseController from './base';

import { todoRegularValidationRule } from '../validate/todoRegular';

export default class TodoRegularController extends BaseController {
    constructor(ctx) {
        super(ctx);
        this.service = ctx.service.todo;
        this.validateRule = todoRegularValidationRule;
    }
}
