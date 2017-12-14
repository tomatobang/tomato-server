'use strict';

const { app, assert } = require('egg-mock/bootstrap');
describe('test/controller/task.test.js', () => {
    let token = '';
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
    it('should load task list', async () => {
        await app.httpRequest()
            .get('/api/task')
            .set('Authorization', token)
            .expect(200);
    });
});
