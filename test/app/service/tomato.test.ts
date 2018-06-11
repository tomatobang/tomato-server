'use strict';

import { app } from 'egg-mock/bootstrap';
import * as assert from 'assert';
describe('test/service/tomato.test.js', () => {
    let ctx;
    before(() => {
        ctx = app.mockContext();
    });

    after(async () => {
        const find_all = await ctx.service.tomato.findAll({}, {
            deleted: true,
            title: 'for test',
        });
        ctx.service.tomato.erase(find_all[0]._id);
    });

    it('should create tomato', async () => {
        const tomato = await ctx.service.tomato.create({
            userid: 'pengyi',
            title: 'for test',
            target: 'target for test',
            description: 'description for test',
            __v: 0,
        });
        assert(tomato.title === 'for test');
    });

    it('should get tomato statistics data', async () => {
        const statistics = await ctx.service.tomato.statistics({
            userid: 'pengyi',
            startTime: new Date('2017-12-01').getTime(),
            tarendTimeget: new Date('2017-12-31').getTime(),
            succeed: 0,
            __v: 0,
        });
        assert(statistics);
    });


    it('should delete tomato', async () => {
        const find_all = await ctx.service.tomato.findAll({}, {
            title: 'for test',
        });
        assert(find_all.length === 1);
        const ret = await ctx.service.tomato.delete(find_all[0]._id);
        assert(ret);
    });
});
