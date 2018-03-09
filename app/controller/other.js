'use strict';
const Controller = require('egg').Controller;
class OtherController extends Controller {
  /**
   * 获取七牛客户端上传 token
   */
  async getQiniuUploadToken() {
    const { ctx, app } = this;
    const uploadToken = await app.qiniu.getuploadToken();
    ctx.status = 200;
    ctx.body = { uploadToken };
  }

  /**
   * just for test
   */
  async test() {
    const { ctx, app } = this;
    const key = 'rate.png';
    const msg = await app.qiniu.publicDownloadUrl(
      key,
      'http://osv2a938x.bkt.clouddn.com'
    );
    ctx.status = 200;
    ctx.body = msg;
  }

  /**
   * just for test
   */
  async testServerUpload() {
    const { ctx, app } = this;
    const localFile = 'D:/rate.png';
    const key = 'rate.png';
    const msg = await app.qiniu.putFile(key, localFile);
    ctx.status = 200;
    ctx.body = msg;
  }
}
module.exports = OtherController;
