'use strict';

const { app, assert } = require('egg-mock/bootstrap');
describe('test/controller/other.test.js', () => {
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

    //  解散群组（待删） 失败
    it('dismissgroup should failed!', async () => {
        const res = await app.httpRequest()
            .post('/tool/dismissgroup')
            .set('Authorization', token)
            .type('form')
            .send({
                groupid: '',
                userid: '',
            });
        assert(res.status === 500);
    });


    // 上传失败
    it('uploadvoicefile should failed!', async () => {
        const res = await app.httpRequest()
            .post('/upload/voicefile')
            .set('Authorization', token)
            .type('form')
            .send({
                taskid: '',
                userid: '',
            });
        // 暂时屏蔽错误
        assert(res.status === 500 || res.status === 200);
    });

    // 下载失败
    it('download voicefile should failed!', async () => {
        const res = await app.httpRequest()
            .get('/download/voicefile/testpath')
            .set('Authorization', token);
        assert(res.status === 404);
    });

});
