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
    const nextday = new Date(datenow.getTime() + 24 * 60 * 60 * 1000);
    ctx.logger.info('query.date：', query.date);
    const gtDate = new Date(datenow.setHours(0, 0, 0, 0));
    const ltDate = new Date(nextday.setHours(0, 0, 0, 0));
    conditions = { create_at: { $gt: gtDate, $lt: ltDate }, deleted: false };
    conditions.userid = ctx.request['currentUser']._id;
    if (query.conditions) {
      conditions = JSON.parse(query.conditions);
    }
    const result = await this.service.getBillList(conditions);
    ctx.body = result;
    ctx.status = 200;
  }


  async listBillByAsset() {
    const { ctx, app } = this;
    let conditions: any;
    conditions = {};
    const body = ctx.request.body;
    if (!body.asset) {
      ctx.body = '资产编号不能为空';
      ctx.status = 403;
      return;
    }
    if (body.num && !(/(^[1-9]\d*$)/.test(body.num))) {
      ctx.body = 'num 必须为整数';
      ctx.status = 403;
      return;
    }
    ctx.logger.info('ctx.request：', ctx.request['currentUser']);
    let datenow = new Date();
    // ISO 格式
   
    if (body.date) {
      ctx.logger.info('query.date：', body.date);
      datenow = new Date(body.date);
    }
    let ltDate = datenow;
    conditions.userid = ctx.request['currentUser']._id;
    conditions.asset = app.mongoose.Types.ObjectId(body.asset);
    // 需减掉 8 小时

    conditions.create_at = { $lt: ltDate };
    conditions.deleted = false;
    console.log('conditions', conditions)

    let requestNum = 10;
    if (body.num) {
      requestNum = parseInt(body.num, 10);
    }
    const result = await this.service.getBillListByAsset(conditions, requestNum);
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
    return res.total;
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
    // if type/asset/amount not changed. we won't need update asset
    if (
      oldBillRecord.type === newBillRecord.type
      && oldBillRecord.create_at.getTime() === new Date(newBillRecord.create_at).getTime()
      && oldBillRecord.amount === newBillRecord.amount
      && oldBillRecord.asset.toString() === newBillRecord.asset) {

    } else {
      const oldAsset = await ctx.service.asset.findById({}, oldBillRecord.asset);

      // asset changed
      if (oldBillRecord.asset.toString() !== newBillRecord.asset) {
        if (oldBillRecord.type === '支出') {
          D_value = oldBillRecord.amount;
        } else {
          D_value = - oldBillRecord.amount;
        }
        oldAsset.amount = oldAsset.amount + D_value;
        // update related bill balance
        await this.updateRelatedRecord(D_value, {
          userid: newBillRecord.userid,
          create_at: oldBillRecord.create_at,
          asset: oldBillRecord.asset,
        });
        // update old asset money
        await ctx.service.asset.updateById(oldAsset._id, oldAsset);

        D_value = 0;
        const newAsset = await ctx.service.asset.findById({}, newBillRecord.asset);
        if (newBillRecord.type === '支出') {
          D_value = 0 - newBillRecord.amount;
        } else {
          D_value = newBillRecord.amount;
        }
        newAsset.amount = newAsset.amount + D_value;
        let sum = await this.getRelatedRecordAmountSum(app, {
          userid: newBillRecord.userid,
          asset: newBillRecord.asset,
          create_at: newBillRecord.create_at,
        });
        newBillRecord.asset_balance = newAsset.amount + sum;
        // update related bill balance
        await this.updateRelatedRecord(D_value, {
          userid: newBillRecord.userid,
          create_at: newBillRecord.create_at,
          asset: newBillRecord.asset,
        });
        await ctx.service.asset.updateById(newAsset._id, newAsset);
      } else { // asset not changed
        if (oldBillRecord.type === '支出') {
          D_value = oldBillRecord.amount;
        } else {
          D_value = 0 - oldBillRecord.amount;
        }
        // update related bill balance
        await this.updateRelatedRecord(D_value, {
          userid: oldBillRecord.userid,
          create_at: oldBillRecord.create_at,
          asset: oldBillRecord.asset,
        });
        oldAsset.amount = oldAsset.amount + D_value;
        D_value = 0;
        if (newBillRecord.type === '支出') {
          D_value = D_value - newBillRecord.amount;
        } else {
          D_value = D_value + newBillRecord.amount;
        }
        oldAsset.amount = oldAsset.amount + D_value;
        let sum = await this.getRelatedRecordAmountSum(app, {
          userid: newBillRecord.userid,
          asset: newBillRecord.asset,
          create_at: newBillRecord.create_at,
        });
        newBillRecord.asset_balance = oldAsset.amount + sum;
        // must minus oldBillRecord.amount
        if (oldBillRecord.create_at > new Date(newBillRecord.create_at)) {
          newBillRecord.asset_balance -= oldBillRecord.amount;
        }
        // update related bill balance
        await this.updateRelatedRecord(D_value, {
          userid: newBillRecord.userid,
          create_at: newBillRecord.create_at,
          asset: newBillRecord.asset,
        });
        await ctx.service.asset.updateById(oldAsset._id, oldAsset);
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
    const { app, ctx } = this;
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
      let sum = await this.getRelatedRecordAmountSum(app, {
        userid: userid,
        asset: fromAsset,
        create_at: date,
      });
      await this.service.create({
        userid: userid,
        asset: fromAsset,
        amount: amount,
        asset_balance: fromAssetModel.amount + sum,
        tag: '资产互转',
        type: '支出',
        create_at: date,
        note: note
      });
      await this.updateRelatedRecord(-amount, {
        userid: userid,
        asset: fromAsset,
        create_at: date,
      });
      await ctx.service.asset.updateById(fromAsset, fromAssetModel);
    }

    const toAsset = requestBody.toAsset;
    const toAssetModel = await ctx.service.asset.findById({}, toAsset);
    if (toAssetModel) {
      console.log(toAssetModel.amount, amount);
      toAssetModel.amount = toAssetModel.amount + amount;
      let sum = await this.getRelatedRecordAmountSum(app, {
        userid: userid,
        asset: toAsset,
        create_at: date,
      });
      await this.service.create({
        userid: userid,
        asset: toAsset,
        amount: amount,
        asset_balance: toAssetModel.amount + sum,
        tag: '资产互转',
        type: '收入',
        create_at: date,
        note: note
      });
      await this.updateRelatedRecord(amount, {
        userid: userid,
        asset: toAsset,
        create_at: date,
      });
      await ctx.service.asset.updateById(toAsset, toAssetModel);
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
    };

  }
}
