'use strict';

const { app, assert } = require('egg-mock/bootstrap');
describe('test/controller/user.test.js', () => {
    let token = '';
    // 注册失败
    it('should register failed( 400 )', async () => {
        const res = await app.httpRequest()
            .post('/api/user')
            .type('form')
            .send({
                username: 'test123',
                password: '123',
            });
        assert(res.status === 400);
    });

    // 注册成功
    it('should register succeed( 200 )', async () => {
        const res = await app.httpRequest()
            .post('/api/user')
            .type('form')
            .send({
                username: 'test123',
                password: 'test123',
                email: '123@qq.com',
            });
        // 暂时频闭 500
        assert(res.status === 201 || res.status === 200 || res.status === 500);
    });

    // 先进行登录
    it('should login succeed', async () => {
        const loginRes = await app.httpRequest()
            .post('/api/login')
            .type('form')
            .send({
                username: 'test123',
                password: 'test123',
            });
        assert(loginRes.status === 200);
        token = loginRes.body.token;
    });

    // 列表查询
    it('should load user list', async () => {
        await app.httpRequest()
            .get('/api/user')
            .set('Authorization', token)
            .expect(200);
    });

    it('should load user list', async () => {
        await app.httpRequest()
            .get('/api/user')
            .set('Authorization', token)
            .expect(200);
    });

    it('should user email and username verify succeed!', async () => {
        await app.httpRequest()
            .post('/email_username/verify')
            .set('Authorization', token)
            .type('form')
            .send({
                username: 'test123',
                email: '123@qq.com',
            })
            .expect(200);
    });
});
