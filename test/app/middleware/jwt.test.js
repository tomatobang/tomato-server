// test/app/middleware/jwt.test.js

const assert = require('assert');
const mock = require('egg-mock');
describe('test/app/middleware/jwt.test.js', () => {
    let app;
    before(() => {
        app = mock.app();
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
            .set('Authorization', "invalidtoken")
            .expect(200)
            .expect({ status: "fail", description: "Token verify failed" });
    });

});

