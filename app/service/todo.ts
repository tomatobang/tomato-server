'use strict';

import BaseService from './base';
export default class TodoService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Todo;
    }

    /**
     * 切换今日番茄钟状态
     * @param { Number } conditions 条件
     * @param { Object } completed 完成状态
     * @return { Object } 查询结果
     */
    async updateByConditions(conditions, completed) {
        const model = this.model;
        const result = await model
            .update(conditions, { completed: completed }, {
                multi: true,
            })
            .exec();
        return result;
    }


    /**
     * 删除今日已完成的番茄钟
     * @param { Number } conditions 条件
     * @return { Object } 结果
     */
    async deleteAllCompletedTodo(conditions) {
        const model = this.model;
        const result = await model
            .update(conditions, { deleted: true }, {
                multi: true,
            })
            .exec();
        return result;
    }

    /**
    * 日历统计数据
    * @param { Number } userid 用户编号
    * @param { Date } startTime 开始时间
    * @param { Date } endTime 结束时间
    * @param { type } finished 记录类型
    * @param { type } range 范围
    * @return { Object } 查询结果
    */
    async statistics(userid, startTime, endTime, completed, range?) {
        const TODO = this.model;
        let rangeType = range || 'day';
        let $projectObj;
        let $groupID;
        $projectObj = {
            // 校准日期并格式化
            create_at: { $substr: [{ $add: ['$create_at', 28800000] }, 0, 10] },
        };
        $groupID = '$create_at';
        if (rangeType === 'month') {
            $groupID = '$yearMonth';
            $projectObj = {
                // 校准日期并格式化
                yearMonth: { $dateToString: { format: "%Y-%m", date: "$create_at" } },
            }
        }
        if (rangeType === 'year') {
            $groupID = '$year';
            $projectObj = {
                // 校准日期并格式化
                year: { $dateToString: { format: "%Y", date: "$create_at" } },
            }
        }

        const res = await TODO.aggregate([
            {
                $match: {
                    userid: userid,
                    deleted: false,
                    completed: completed,
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
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        return res;
    }

}
