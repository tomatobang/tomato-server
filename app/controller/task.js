'use strict';
const BaseController = require('./base');
class TaskController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.task;
  }
}
module.exports = TaskController;
