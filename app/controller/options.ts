'use strict';
import { BaseController } from './base';
export default class OptionsController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.options;
  }
}
