'use strict';
import BaseController from './base';
export default class MessageController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.message;
  }
}
