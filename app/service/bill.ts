'use strict';

import BaseService from './base';
export default class BillService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Bill;
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
            .select('_id create_at note asset tag amount type');

        return result;
    }

    /**
     * 日历统计数据
     * @param { Number } userid 用户编号
     * @param { Date } startTime 开始时间
     * @param { Date } endTime 结束时间
     * @param { type } type 记录类型
     * @param { type } range 范围
     * @return { Object } 查询结果
     */
    async statistics(userid, startTime, endTime, type, range?) {
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

        const res = await Bill.aggregate([
            {
                $match: {
                    userid: userid,
                    deleted: false,
                    type: type,
                    create_at: { $gte: new Date(startTime), $lte: new Date(endTime) },
                },
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
