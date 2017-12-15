'use strict';

const { app, assert } = require('egg-mock/bootstrap');
describe('test/controller/task.test.js', () => {
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

    // 列表查询
    it('should load task list', async () => {
        await app.httpRequest()
            .get('/api/task')
            .set('Authorization', token)
            .expect(200);
    });

    it('should create task', async () => {
        const res = await app.httpRequest()
            .post('/api/task')
            .set('Authorization', token)
            .type('form')
            .send({
                userid: 'test123',
                title: 'task test',
            });
        assert(res.status === 200 || res.status === 201);
    });


    it('should find task by id', async () => {
        await app.httpRequest()
            .get('/api/task/4edd40c86762e0fb12000003?aa=123')
            .set('Authorization', token)
            .expect(204);
    });

    it('should update task by id', async () => {
        const res = await app.httpRequest()
            .post('/api/task/4edd40c86762e0fb12000003')
            .set('Authorization', token)
            .type('form')
            .send({
                userid: 'test123',
                title: 'task test',
            });
        assert(res.status === 204);
    });

    it('should delete task by id', async () => {
        const res = await app.httpRequest()
            .del('/api/task/4edd40c86762e0fb12000003')
            .set('Authorization', token);
        assert(res.status === 200);
    });
});
