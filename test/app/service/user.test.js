'use strict';

const { app, assert } = require('egg-mock/bootstrap');
describe('test/service/user.test.js', () => {
    let ctx;
    before(() => {
        ctx = app.mockContext();
    });

    after(async () => {
        const find_all = await ctx.service.user.findAll({}, {
            deleted: true,
            username: 'test',
        });
        ctx.service.user.erase(find_all[0]._id);
    });

    it('should create user', async () => {
        const user = await ctx.service.user.create({
            username: 'test',
            password: '123',
            email: '333@qq.com',
            __v: 0,
        });
        assert(user.username === 'test');
    });


    it('email username verify failed', async () => {
        const { emailRet, usernameRet } = await ctx.service.user.emailUserNameVerify(
            '333@qq.com', 'test'
        );
        assert(emailRet.length > 0);
        assert(usernameRet.length > 0);
    });

    it('update user fields succeed', async () => {
        const find_all = await ctx.service.user.findAll({}, {
            username: 'test',
        });
        assert(find_all.length === 1);
        let result = await ctx.service.user.updateHeadImg(
            find_all[0]._id,
            'new img url'
        );
        assert(result.img === 'new img url');

        result = await ctx.service.user.updateSex(
            find_all[0]._id,
            'man'
        );
        assert(result.sex === 'man');

        result = await ctx.service.user.updateDisplayName(
            find_all[0]._id,
            'new displayName'
        );
        assert(result.displayName === 'new displayName');

        result = await ctx.service.user.updateEmail(
            find_all[0]._id,
            'new email'
        );
        assert(result.email === 'new email');

        result = await ctx.service.user.updateLocation(
            find_all[0]._id,
            'new location'
        );
        assert(result.location === 'new location');

        assert(result.img === 'new img url');
    });

    it('should delete user', async () => {
        const find_all = await ctx.service.user.findAll({}, {
            username: 'test',
        });
        assert(find_all.length === 1);
        const ret = await ctx.service.user.delete(find_all[0]._id);
        assert(ret);
    });


    it('hasUser:should return false', async () => {
        const finded = await ctx.service.user.hasUser('xxxx');
        assert(finded === false);
    });
    
});
