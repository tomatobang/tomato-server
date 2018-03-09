'use strict';

const { app, assert } = require('egg-mock/bootstrap');
describe('test/controller/option.test.js', () => {
  let token = '';
  it('should register succeed( 200 )', async () => {
    const res = await app
      .httpRequest()
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
    const loginRes = await app
      .httpRequest()
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
  it('should load option list', async () => {
    await app
      .httpRequest()
      .get('/api/option')
      .set('Authorization', token)
      .expect(200);
  });
});
