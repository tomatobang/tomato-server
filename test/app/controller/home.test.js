'use strict';

const { app, assert } = require('egg-mock/bootstrap');
describe('test/controller/home.test.js', () => {
    let token = '';
    // 注册失败
    it('should register failed( 400 )', async () => {
        const loginRes = await app.httpRequest()
            .post('/api/user')
            .type('form')
            .send({
                username: 'test123',
                password: '123',
            });
        assert(loginRes.status === 400);
    });

    // 注册失败
    it('should register succeed( 200 )', async () => {
        const loginRes = await app.httpRequest()
            .post('/api/user')
            .type('form')
            .send({
                username: 'test123',
                password: 'test123',
            });
        assert(loginRes.status === 201 || loginRes.status === 200);
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
    it('should status 200 and get the body', () => {
        return app.httpRequest()
            .get('/')
            .set('Authorization', token)
            .expect(200)
            .expect('Hello, this is TomatoBang Index Page');
    });
});
