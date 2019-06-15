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

    conditions = { create_at: { $gt: new Date(dateStr).toISOString(), $lt: new Date(dateNextStr).toISOString() }, deleted: false };
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

    const asset = await ctx.service.asset.findById({}, ctx.request.body.asset);
    const newBillRecord = ctx.request.body;
    let oldAmount = asset.amount;
    let newAmount;
    let D_value = 0;
    if (newBillRecord.type === '支出') {
      newAmount = oldAmount - newBillRecord.amount;
      D_value = 0 - newBillRecord.amount;
    } else {
      newAmount = oldAmount + newBillRecord.amount;
      D_value = newBillRecord.amount;
    }
    asset.amount = newAmount;
    let sum = await this.getRelatedRecordAmountSum(app, {
      userid: newBillRecord.userid,
      asset: newBillRecord.asset,
      create_at: newBillRecord.create_at,
    });
    newBillRecord.asset_balance = newAmount + sum;
    const result = await this.service.create(newBillRecord);
    await ctx.service.asset.updateById(asset._id, asset);
    // update related bill balance
    await this.updateRelatedRecord(D_value, {
      userid: newBillRecord.userid,
      asset: newBillRecord.asset,
      create_at: newBillRecord.create_at,
    });
    ctx.status = 200;
    ctx.body = result;
  }

  async updateRelatedRecord(D_value, options: { userid, asset, create_at }) {
    await this.service.updateBillByCondition({
      userid: options.userid,
      asset: options.asset,
      create_at: { $gt: new Date(options.create_at) },
    }, D_value);
  }

  async getRelatedRecordAmountSum(app, options: { userid, asset, create_at }) {
    let res = await this.service.getSumOfAmount({
      userid: app.mongoose.Types.ObjectId(options.userid),
      asset: app.mongoose.Types.ObjectId(options.asset),
      create_at: { $gt: new Date(options.create_at) },
    });
    if (res.length > 0) {
      return res[0].total;
    } else {
      return 0;
    }
  }

  /**
   * update record by id
   */
  async updateById() {
    const { app, ctx } = this;
    const id = ctx.params.id;
    const newBillRecord = ctx.request.body;
    newBillRecord.userid = ctx.request['currentUser']._id;
    const oldBillRecord = await this.service.findById({}, id);
    let D_value = 0;
    // if type/asset/amount not changed. we not need update asset
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
          D_value = oldBillRecord.amount;
          newAmount_delete = oldBillAsset.amount + oldBillRecord.amount;
        } else {
          D_value = - oldBillRecord.amount;
          newAmount_delete = oldBillAsset.amount - oldBillRecord.amount;
        }
        oldBillAsset.amount = newAmount_delete;
        // update related bill balance
        await this.updateRelatedRecord(D_value, {
          userid: newBillRecord.userid,
          create_at: oldBillRecord.create_at,
          asset: oldBillRecord.asset,
        });
        await ctx.service.asset.updateById(oldBillAsset._id, oldBillAsset);

        D_value = 0;
        const newBillAsset = await ctx.service.asset.findById({}, newBillRecord.asset);
        let newAmount;
        if (newBillRecord.type === '支出') {
          newAmount = newBillAsset.amount - newBillRecord.amount;
          D_value = 0 - newBillRecord.amount;
        } else {
          newAmount = newBillAsset.amount + newBillRecord.amount;
          D_value = newBillRecord.amount;
        }
        newBillAsset.amount = newAmount;
        let sum = await this.getRelatedRecordAmountSum(app, {
          userid: newBillRecord.userid,
          asset: newBillRecord.asset,
          create_at: newBillRecord.create_at,
        });
        newBillRecord.asset_balance = newAmount + sum;
        // update related bill balance
        await this.updateRelatedRecord(D_value, {
          userid: newBillRecord.userid,
          create_at: newBillRecord.create_at,
          asset: newBillRecord.asset,
        });
        await ctx.service.asset.updateById(newBillAsset._id, newBillAsset);
      } else { // asset not changed
        let newAmount;
        if (oldBillRecord.type === '支出') {
          D_value = oldBillRecord.amount;
          newAmount = oldBillAsset.amount + oldBillRecord.amount;
        } else {
          D_value = 0 - oldBillRecord.amount;
          newAmount = oldBillAsset.amount - oldBillRecord.amount;
        }
        if (newBillRecord.type === '支出') {
          D_value = D_value - newBillRecord.amount;
          newAmount = newAmount - newBillRecord.amount;
        } else {
          D_value = D_value + newBillRecord.amount;
          newAmount = newAmount + newBillRecord.amount;
        }
        oldBillAsset.amount = newAmount;
        let sum = await this.getRelatedRecordAmountSum(app, {
          userid: newBillRecord.userid,
          asset: newBillRecord.asset,
          create_at: newBillRecord.create_at,
        });
        newBillRecord.asset_balance = newAmount + sum;
        // update related bill balance
        await this.updateRelatedRecord(D_value, {
          userid: newBillRecord.userid,
          create_at: newBillRecord.create_at,
          asset: newBillRecord.asset,
        });
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
    let D_value = 0;
    if (bill.type === '支出') {
      newAmount = oldAmount + bill.amount;
      D_value = bill.amount;
    } else {
      newAmount = oldAmount - bill.amount;
      D_value = 0 - bill.amount;
    }
    asset.amount = newAmount;
    // update related bill balance
    await this.updateRelatedRecord(D_value, {
      userid: bill.userid,
      asset: bill.asset,
      create_at: bill.create_at,
    });
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
      return;
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

  /**
   * asset to asset
   */
  async billExchange() {
    const { ctx } = this;
    const requestBody = ctx.request.body;
    const date = requestBody.date;
    const note = requestBody.note;
    let userid = '';
    if (ctx.request['currentUser'] || !date) {
      userid = ctx.request['currentUser']._id;
    } else {
      ctx.status = 200;
      ctx.body = [];
      return;
    }

    const amount = parseFloat(requestBody.amount);
    const fromAsset = requestBody.fromAsset;

    const fromAssetModel = await ctx.service.asset.findById({}, fromAsset);
    if (fromAssetModel) {
      fromAssetModel.amount = fromAssetModel.amount - amount;
      await this.service.create({
        userid: userid,
        asset: fromAsset,
        amount: amount,
        asset_balance: fromAssetModel.amount,
        tag: '资产互转',
        type: '支出',
        create_at: date,
        note: note
      });
      await ctx.service.asset.updateById(fromAsset, fromAssetModel);
    }

    const toAsset = requestBody.toAsset;
    const toAssetModel = await ctx.service.asset.findById({}, toAsset);
    if (toAssetModel) {
      console.log(toAssetModel.amount, amount);
      toAssetModel.amount = toAssetModel.amount + amount;
      console.log(toAssetModel.amount, amount);
      await this.service.create({
        userid: userid,
        asset: toAsset,
        amount: amount,
        asset_balance: toAssetModel.amount,
        tag: '资产互转',
        type: '收入',
        create_at: date,
        note: note
      });
      await ctx.service.asset.updateById(toAsset, toAssetModel);
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
    };

  }
}
