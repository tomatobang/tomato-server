const { app, mock, assert } = require('egg-mock/bootstrap');
describe('test/controller/home.test.js', () => {
    let token = "";
    // 先进行登录
    it('should login succeed',async () => {
        let loginRes = await app.httpRequest()
            .post('/api/login')
            .type('form')
            .send({
                username: 'pengyi',
                password: 'pengyi',
            });
        assert(loginRes.status === 200);
        token = loginRes.body.token;
    });

    it('should status 200 and get the body', () => {
        // 对 app 发起 `GET /` 请求
        return app.httpRequest()
            .get('/')
            .set('Authorization', token)
            .expect(200)
            .expect('Hello, this is TomatoBang Index Page');
    });
});