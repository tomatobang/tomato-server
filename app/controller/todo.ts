'use strict';

import BaseController from './base';
import { todoValidationRule } from '../validate/todo';

export default class TodoController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.todo;
    this.validateRule = todoValidationRule;
  }

  /**
   * search with conditions
   */
  async list() {
    const { ctx } = this;
    let conditions: any;
    conditions = {};
    const query = ctx.request.query;
    ctx.logger.info('ctx.request：', ctx.request['currentUser']);
    let datenow = new Date();
    if (query.date) {
      datenow = new Date(query.date);
    }
    datenow = new Date(datenow.getTime());
    const nextday = new Date(datenow.getTime() + 24 * 60 * 60 * 1000);
    ctx.logger.info('query.date：', query.date);
    const gtDate = new Date(datenow.setHours(0,0,0,0));
    const ltDate = new Date(nextday.setHours(0,0,0,0));
    conditions = { create_at: { $gt: gtDate, $lt: ltDate }, deleted: false };
    conditions.userid = ctx.request['currentUser']._id;
    if (query.conditions) {
      conditions = JSON.parse(query.conditions);
    }
    const result = await this.service.findAll(query, conditions);
    ctx.body = result;
    ctx.status = 200;
  }

  /**
  * create record
  */
  async create() {
    const { ctx, app } = this;
    // filter with logged userinfo
    ctx.request.body.userid = ctx.request['currentUser']._id;
    if (this.validateRule) {
      const invalid = app['validator'].validate(
        this.validateRule,
        ctx.request.body
      );
      if (invalid) {
        ctx.throw(400);
      }
    }
    const result = await this.service.create(ctx.request.body);
    ctx.status = 200;
    ctx.body = result;
  }

  /**
  * toggle All todo record
  */
  async toggleAllTodo() {
    const { ctx } = this;
    let conditions: any;
    conditions = {};
    ctx.logger.info('ctx.request：', ctx.request['currentUser']);
    let datenow = new Date();
    let gteDate = new Date(datenow.setHours(0,0,0,0));
    conditions = { create_at: { $gte: gteDate } };
    conditions.userid = ctx.request['currentUser']._id;
    const completeStatu = ctx.request.body.complete;

    console.log(conditions, completeStatu);
    const result = await this.service.updateByConditions(conditions, completeStatu);
    ctx.status = 200;
    ctx.body = result;
  }

  /**
  * delete All completed todo record
  */
  async deleteAllCompletedTodo() {
    const { ctx } = this;
    let conditions: any;
    conditions = {};
    ctx.logger.info('ctx.request：', ctx.request['currentUser']);
    let datenow = new Date();
    const gteDate = new Date(datenow.setHours(0,0,0,0));
    conditions.userid = ctx.request['currentUser']._id;
    conditions = {
      create_at: { $gte: gteDate },
      completed: true
    };

    const result = await this.service.deleteAllCompletedTodo(conditions);
    ctx.status = 200;
    ctx.body = result;
  }

  /**
  * daily income and expenditure statistics
  */
  async statistics() {
    const { ctx, app } = this;
    const date = ctx.request.body.date;
    let userid = '';
    if (ctx.request['currentUser'] || !date) {
      userid = ctx.request['currentUser']._id;
    } else {
      ctx.status = 200;
      ctx.body = [];
    }
    const starDate = ctx.helper.dateHelper.getCurrentMonthFirst(date);
    const endDate = ctx.helper.dateHelper.getNextMonthFirst(date);
    const completed = await this.service.statistics(
      app.mongoose.Types.ObjectId(userid),
      starDate,
      endDate,
      true
    );
    const imcompleted = await this.service.statistics(
      app.mongoose.Types.ObjectId(userid),
      starDate,
      endDate,
      false
    );
    ctx.status = 200;
    ctx.body = {
      completed: completed,
      imcompleted: imcompleted
    };

  }
}
