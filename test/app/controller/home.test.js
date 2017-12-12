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

    // 注册失败
    it('should register failed( 400 )',async () => {
        let loginRes = await app.httpRequest()
            .post('/api/user')
            .type('form')
            .send({
                username: 'pengyi',
                password: '123',
            });
        assert(loginRes.status === 400);
    });

    it('should status 200 and get the body', () => {
        return app.httpRequest()
            .get('/')
            .set('Authorization', token)
            .expect(200)
            .expect('Hello, this is TomatoBang Index Page');
    });
});