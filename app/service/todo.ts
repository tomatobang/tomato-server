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

}
