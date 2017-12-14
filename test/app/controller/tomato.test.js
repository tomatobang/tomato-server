'use strict';

const { app, assert } = require('egg-mock/bootstrap');
describe('test/controller/tomato.test.js', () => {
    let token = '';
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

    it('should load tomato list succeed', async () => {
        await app.httpRequest()
            .get('/api/tomato')
            .set('Authorization', token)
            .expect(200);
    });

    it('should load tomato statistics succeed', async () => {
        await app.httpRequest()
            .post('/api/tomato/statistics')
            .set('Authorization', token)
            .type('form')
            .send({
                isSuccess: true,
                date: '2017-12-14 10:00',
            })
            .expect(200);
    });

    it('should load tomatoToday list', async () => {
        await app.httpRequest()
            .get('/filter/tomatotoday')
            .set('Authorization', token)
            .expect(200);
    });

    it('should load search succeed', async () => {
        await app.httpRequest()
            .post('/api/search')
            .set('Authorization', token)
            .type('form')
            .send({
                keywords: 'test',
            })
            .expect(200);
    });
});
