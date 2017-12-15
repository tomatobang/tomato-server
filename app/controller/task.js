'use strict';
const BaseController = require('./base');
const taskValidationRule = require('../validate/task');
class TaskController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.task;
    this.validateRule = taskValidationRule;
  }
}
module.exports = TaskController;
