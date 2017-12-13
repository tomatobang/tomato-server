'use strict';
const BaseController = require('./base');
class MessageController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.message;
  }
}
module.exports = MessageController;
