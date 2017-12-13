'use strict';
const BaseService = require('./base');

class MessageService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.Message;
  }
}

module.exports = MessageService;
