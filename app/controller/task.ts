'use strict';
import BaseController from './base';

import { taskValidationRule, relateUrlValidationRule } from '../validate/task';

export default class TaskController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.task;
    this.validateRule = taskValidationRule;
  }

  /**
   * update task voice media url
   */
  async updateVoiceUrl() {
    const { ctx, app } = this;
    const invalid = app['validator'].validate(
      relateUrlValidationRule,
      ctx.request.body
    );
    if (invalid) {
      ctx.body = {
        status: 'fail',
        description: 'request parame(s) error！',
      };
      return;
    }
    const taskid = ctx.request.body.taskid;
    const relateUrl = ctx.request.body.relateUrl;
    await ctx.service.task.updateVoiceUrl(taskid, relateUrl);
    ctx.status = 200;
    ctx.body = {
      success: true,
    };
  }
}
