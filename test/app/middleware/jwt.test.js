// test/app/middleware/jwt.test.js

const assert = require('assert');
const mock = require('egg-mock');
describe('test/app/middleware/jwt.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });
  afterEach(mock.restore);
  it('should return token required', () => {
    return app.httpRequest()
      .get('/')
      .expect(200)
      .expect('{"status":"fail","description":"Token not found"}'); 
  });

  it('should return token invalid', () => {
    return app.httpRequest()
      .get('/')
      .set('Authorization', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlbmd5aSIsInRpbWVzdGFtcCI6MTUwOTUxODMwNzI0NSwiaWF0IjoxNTA5NTE4MzA3LCJleHAiOjE1MDk2MDQ3MDd9.vlPzj_m4Q8A01NobJh5DRLIvnd-ohfC1ZEWyUxvi674")
      .expect(200)
      .expect('{"status":"fail","description":"Token invalid"}');
  });

});

