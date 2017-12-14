'use strict';

const { app, assert } = require('egg-mock/bootstrap');
describe('test/service/version.test.js', () => {
    let ctx;
    before(() => {
        ctx = app.mockContext();
    });

    it('should create version', async () => {
        const version = await ctx.service.version.create({
            version: '1.3.4',
            // 更新内容
            updateContent: 'for test',
            // 下载地址
            downloadUrl: 'for test',
            // 大小
            size: '12',
            // 发布时间
            datetime: new Date(),
        });
        assert(version.version === '1.3.4');
    });

    it('should load version info succeed', async () => {
        const version = await ctx.service.version.findLatestVersion();
        assert(version[0].version === '1.3.4');
    });

    it('should delete version', async () => {
        const find_all = await ctx.service.version.findAll({}, {
            version: '1.3.4',
        });
        ctx.service.version.erase(find_all[0]._id);
    });

});
