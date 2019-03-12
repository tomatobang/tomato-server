'use strict';
import BaseController from './base';

import { billValidationRule } from '../validate/bill';

export default class BillController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.bill;
    this.validateRule = billValidationRule;
  }

  /**
  * search with conditions. such as date
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
    const date =
      datenow.getFullYear() +
      '-' +
      (datenow.getMonth() + 1) +
      '-' +
      datenow.getDate();
    conditions = { create_at: { $gte: new Date(date).toISOString() }, deleted: false };
    if (ctx.request['currentUser']) {
      conditions.userid = ctx.request['currentUser']._id;
    }
    if (query.conditions) {
      conditions = JSON.parse(query.conditions);
    }
    const result = await this.service.getBillList(conditions);
    ctx.body = result;
    ctx.status = 200;
  }

  /**
  * create record
  */
  async create() {
    const { ctx, app } = this;
    // filter with logged userinfo
    if (ctx.request['currentUser']) {
      ctx.request.body.userid = ctx.request['currentUser']._id;
    }
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

    const asset = await ctx.service.asset.findById({}, ctx.request.body.asset);
    let oldAmount = asset.amount;
    let newAmount;
    if (ctx.request.body.type === '支出') {
      newAmount = oldAmount - ctx.request.body.amount;
    } else {
      newAmount = oldAmount + ctx.request.body.amount;
    }
    asset.amount = newAmount;
    await ctx.service.asset.updateById(asset._id, asset);
    ctx.status = 200;
    ctx.body = result;
  }

  /**
 * delete record by id
 */
  async deleteById() {
    const { ctx } = this;
    const id = ctx.params.id;
    const bill = await ctx.service.bill.findById({}, id);
    const asset = await ctx.service.asset.findById({}, bill.asset);
    let oldAmount = asset.amount;
    let newAmount;
    if (bill.type === '支出') {
      newAmount = oldAmount + bill.amount;
    } else {
      newAmount = oldAmount - bill.amount;
    }
    asset.amount = newAmount;
    await ctx.service.asset.updateById(asset._id, asset);
    const result = await ctx.service.bill.delete(bill._id);
    ctx.body = result;
  }

  /**
   * 统计每日收入与支出
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
    const income = await ctx.service.bill.statistics(
      app.mongoose.Types.ObjectId(userid),
      starDate,
      endDate,
      '收入'
    );
    const pay = await ctx.service.bill.statistics(
      app.mongoose.Types.ObjectId(userid),
      starDate,
      endDate,
      '支出'
    );
    ctx.status = 200;
    ctx.body = {
      income: income,
      pay: pay
    };

  }
}
