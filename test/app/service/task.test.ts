'use strict';

import { app } from 'egg-mock/bootstrap';
import * as assert from 'assert';
describe('test/service/task.test.js', () => {
    let ctx;
    before(() => {
        ctx = app.mockContext();
    });

    after(async () => {
        const find_all = await ctx.service.task.findAll({}, {
            deleted: true,
            title: 'for test',
        });
        ctx.service.task.erase(find_all[0]._id);
    });

    it('should create task', async () => {
        const task = await ctx.service.task.create({
            title: 'for test',
            target: 'target for test',
            isActive: true,
            num: 1,
            description: 'description for test',
            __v: 0,
        });
        assert(task.title === 'for test');
        assert(task.isActive);
    });

    it('should delete task', async () => {
        const find_all = await ctx.service.task.findAll({}, {
            title: 'for test',
        });
        assert(find_all.length === 1);
        const ret = await ctx.service.task.delete(find_all[0]._id);
        assert(ret);
    });
});
