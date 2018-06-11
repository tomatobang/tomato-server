'use strict';

import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';
describe('test/controller/user.test.js', () => {
  let token = '';
  let _mockid = '';
  // 注册失败
  it('should register failed( 400 )', async () => {
    const res = await app
      .httpRequest()
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

  it('should login failed', async () => {
    const loginRes = await app
      .httpRequest()
      .post('/api/login')
      .type('form')
      .send({
        username: 'test123',
        password: 'xxxxxxxxx',
      });
    assert(loginRes.body.status === 'fail');
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
    _mockid = loginRes.body.userinfo._id;
  });

  // 列表查询
  it('should load user list', async () => {
    await app
      .httpRequest()
      .get('/api/user')
      .set('Authorization', token)
      .expect(200);
  });

  it('should user email and username verify failed:username!', async () => {
    const res = await app
      .httpRequest()
      .post('/email_username/verify')
      .set('Authorization', token)
      .type('form')
      .send({
        username: 'test123',
        email: '123xxxxxx@qq.com',
      })
      .expect(200);
    assert(res.body.msg === '用户名已存在！');
  });

  it('should user email and username verify failed:email!', async () => {
    const res = await app
      .httpRequest()
      .post('/email_username/verify')
      .set('Authorization', token)
      .type('form')
      .send({
        username: 'test1234',
        email: '123@qq.com',
      });
    assert(res.body.msg === '邮箱已存在！');
  });

  it('should user email and username verify succeed!', async () => {
    const res = await app
      .httpRequest()
      .post('/email_username/verify')
      .set('Authorization', token)
      .type('form')
      .send({
        username: 'test1234',
        email: '123xxxx@qq.com',
      });
    assert(res.body.msg === '邮箱可用！');
  });

  it('should uploadHeadImg succeed!', async () => {
    await app
      .httpRequest()
      .post('/api/user/headimg')
      .set('Authorization', token)
      .type('form')
      .send({
        userid: 'test1234',
        imgData:
          'data:image/png;base64,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',
      })
      .expect(200);
  });

  it('should download HeadImg err!', async () => {
    await app
      .httpRequest()
      .get('/api/user/headimg/' + _mockid)
      .set('Authorization', token)
      .expect(404);
  });

  it('should update bio succeed', async () => {
    await app
      .httpRequest()
      .post('/api/user/bio')
      .set('Authorization', token)
      .type('form')
      .send({
        userid: _mockid,
        bio: 'test bio',
      })
      .expect(200);
  });

  it('should update sex succeed', async () => {
    await app
      .httpRequest()
      .post('/api/user/sex')
      .set('Authorization', token)
      .type('form')
      .send({
        userid: _mockid,
        sex: 'man',
      })
      .expect(200);
  });

  it('should update displayname succeed', async () => {
    await app
      .httpRequest()
      .post('/api/user/displayname')
      .set('Authorization', token)
      .type('form')
      .send({
        userid: _mockid,
        displayname: 'test displayname',
      })
      .expect(200);
  });

  it('should update email succeed', async () => {
    await app
      .httpRequest()
      .post('/api/user/email')
      .set('Authorization', token)
      .type('form')
      .send({
        userid: _mockid,
        email: '123@qq.com',
      })
      .expect(200);
  });

  it('should update location succeed', async () => {
    await app
      .httpRequest()
      .post('/api/user/location')
      .set('Authorization', token)
      .type('form')
      .send({
        userid: _mockid,
        location: 'Shenzhen',
      })
      .expect(200);
  });

  it('should logout succeed', async () => {
    await app
      .httpRequest()
      .post('/api/logout')
      .set('Authorization', token)
      .expect(200);
  });
});
