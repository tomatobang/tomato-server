'use strict';

import BaseService from './base';
export default class BillService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Bill;
    }

    /**
     * 更新相关账单余额
     * @param conditions 查询条件
     * @param D_value 差值
     */
    async updateBillByCondition(conditions, D_value) {
        conditions.deleted = false;
        const result = await this.model.find(conditions);

        result.forEach(
            async (item) => {
                await this.model.update({ "_id": item._id }, { "$set": { "asset_balance": item.asset_balance + D_value } }, {})
            }
        );
        return result;
    }

    /**
     * 获取累计值
     * @param conditions 查询条件
     */
    async getSumOfAmount(conditions) {
        conditions.deleted = false;
        let ret = {
            total: 0
        };
        const res = await this.model.aggregate([
            {
                $match: conditions,
            },
            {
                $project: {
                    userid: 1,
                    type: 1,
                    amount: 1,
                },
            },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    total: { $sum: "$amount" }
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            if (element._id === "支出") {
                ret.total += element.total;
            } else {
                ret.total -= element.total;
            }

        }
        return ret;
    }

    /**
     * 获取账单列表
     * @param { String } conditions 条件
     */
    async getBillList(conditions) {
        const result = await this.model
            .find(conditions)
            .populate({ path: 'asset', select: 'name' })
            .sort('-create_at')
            .select('_id create_at note asset asset_balance tag amount type');

        return result;
    }

    /**
     * 获取资产获取账单列表
     * @param { String } conditions 条件
     * @param { String } num 显示条数
     */
    async getBillListByAsset(conditions, num) {
        const result = await this.model
            .find(conditions)
            .sort('-create_at')
            .select('_id create_at note asset asset_balance tag amount type')
            .limit(num);

        return result;
    }

    /**
     * 日历统计数据
     * @param { Number } userid 用户编号
     * @param { Date } startTime 开始时间
     * @param { Date } endTime 结束时间
     * @param { type } type 记录类型
     * @param { type } range 范围
     * @param { type } excludeTag 需要排除的标签
     * @return { Object } 查询结果
     */
    async statistics(userid, startTime, endTime, type, range?, excludeTag?) {
        const Bill = this.model;
        let rangeType = range || 'day';
        let $projectObj;
        let $groupID;
        $projectObj = {
            // 校准日期并格式化
            amount: 1,
            create_at: { $substr: [{ $add: ['$create_at', 28800000] }, 0, 10] },
        };
        $groupID = '$create_at';
        if (rangeType === 'month') {
            $groupID = '$yearMonth';
            $projectObj = {
                // 校准日期并格式化
                amount: 1,
                yearMonth: { $dateToString: { format: "%Y-%m", date: "$create_at" } },
            }
        }
        if (rangeType === 'year') {
            $groupID = '$year';
            $projectObj = {
                // 校准日期并格式化
                amount: 1,
                year: { $dateToString: { format: "%Y", date: "$create_at" } },
            }
        }

        let conditions;
        conditions = {
            userid: userid,
            deleted: false,
            type: type,
            tag: { $ne: '资产互转' },
            create_at: { $gte: new Date(startTime), $lte: new Date(endTime) },
        };
        if (excludeTag) {
            conditions.tag = { $nin: [excludeTag, '资产互转'] };
        }

        const res = await Bill.aggregate([
            {
                $match: conditions,
            },
            {
                $project: $projectObj,
            },
            {
                $group: {
                    _id: $groupID,
                    count: { $sum: 1 },
                    total: { $sum: "$amount" }
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        return res;
    }
}
