'use strict';
import BaseService from './base';

export default class MessageService extends BaseService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.Message;
  }
}
