'use strict';

import { app } from 'egg-mock/bootstrap';
describe('test/controller/version.test.js', () => {
  // 查找最新版本
  it('should load latest version', async () => {
    await app
      .httpRequest()
      .get('/api/version')
      .expect(200);
  });
});
