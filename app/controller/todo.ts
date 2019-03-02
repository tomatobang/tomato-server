'use strict';
import BaseController from './base';

import { todoValidationRule } from '../validate/todo';

export default class TodoController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.todo;
    this.validateRule = todoValidationRule;
  }
}
