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
    let nextday = new Date(datenow.getTime() + 24 * 60 * 60 * 1000);
    if (query.date) {
      datenow = new Date(query.date);
      nextday = new Date(datenow.getTime() + 24 * 60 * 60 * 1000);
    }
    ctx.logger.info('query.date：', query.date);
    const dateStr =
      datenow.getFullYear() +
      '-' +
      (datenow.getMonth() + 1) +
      '-' +
      datenow.getDate();
    const dateNextStr =
      nextday.getFullYear() +
      '-' +
      (nextday.getMonth() + 1) +
      '-' +
      nextday.getDate();

    conditions = { create_at: { $gte: new Date(dateStr).toISOString(), $lt: new Date(dateNextStr).toISOString() }, deleted: false };
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


    const asset = await ctx.service.asset.findById({}, ctx.request.body.asset);
    let oldAmount = asset.amount;
    let newAmount;
    if (ctx.request.body.type === '支出') {
      newAmount = oldAmount - ctx.request.body.amount;
    } else {
      newAmount = oldAmount + ctx.request.body.amount;
    }
    asset.amount = newAmount;
    ctx.request.body.asset_balance = newAmount;
    const result = await this.service.create(ctx.request.body);
    await ctx.service.asset.updateById(asset._id, asset);
    ctx.status = 200;
    ctx.body = result;
  }

  /**
   * update record by id
   */
  async updateById() {
    const { ctx } = this;
    const id = ctx.params.id;

    const newBillRecord = ctx.request.body;
    const oldBillRecord = await this.service.findById({}, id);

    // if (type and asset and amount) not changed. then we not need update asset
    if (
      oldBillRecord.type === newBillRecord.type
      && oldBillRecord.amount === newBillRecord.amount
      && oldBillRecord.asset === newBillRecord.asset) {

    } else {
      const oldBillAsset = await ctx.service.asset.findById({}, oldBillRecord.asset);

      // asset changed
      if (oldBillRecord.asset !== newBillRecord.asset) {
        let newAmount_delete;
        if (oldBillRecord.type === '支出') {
          newAmount_delete = oldBillAsset.amount + oldBillRecord.amount;
        } else {
          newAmount_delete = oldBillAsset.amount - oldBillRecord.amount;
        }
        oldBillAsset.amount = newAmount_delete;
        await ctx.service.asset.updateById(oldBillAsset._id, oldBillAsset);

        const newBillAsset = await ctx.service.asset.findById({}, newBillRecord.asset);
        let newAmount;
        if (newBillRecord.type === '支出') {
          newAmount = newBillAsset.amount - ctx.request.body.amount;
        } else {
          newAmount = newBillAsset.amount + ctx.request.body.amount;
        }
        newBillAsset.amount = newAmount;
        newBillRecord.asset_balance = newAmount;
        await ctx.service.asset.updateById(newBillAsset._id, newBillAsset);
      } else { // asset not changed
        let newAmount;
        if (oldBillRecord.type === '支出') {
          newAmount = oldBillAsset.amount + oldBillRecord.amount;
        } else {
          newAmount = oldBillAsset.amount - oldBillRecord.amount;
        }
        if (newBillRecord.type === '支出') {
          newAmount = oldBillAsset.amount - ctx.request.body.amount;
        } else {
          newAmount = oldBillAsset.amount + ctx.request.body.amount;
        }
        oldBillAsset.amount = newAmount;
        newBillRecord.asset_balance = newAmount;
        await ctx.service.asset.updateById(oldBillAsset._id, oldBillAsset);
      }
    }
    const result = await this.service.updateById(id, newBillRecord);
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

    const type = ctx.request.body.type;
    const excludeTag = ctx.request.body.excludeTag;
    const starDate = ctx.helper.dateHelper.getCurrentMonthFirst(date);
    const endDate = ctx.helper.dateHelper.getNextMonthFirst(date);
    const income = await ctx.service.bill.statistics(
      app.mongoose.Types.ObjectId(userid),
      starDate,
      endDate,
      '收入',
      type ? type : 'day',
      excludeTag ? excludeTag : null,
    );
    const pay = await ctx.service.bill.statistics(
      app.mongoose.Types.ObjectId(userid),
      starDate,
      endDate,
      '支出',
      type ? type : 'day',
      excludeTag ? excludeTag : null,
    );
    ctx.status = 200;
    ctx.body = {
      income: income,
      pay: pay
    };

  }
}
