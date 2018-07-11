'use strict';
import { Controller } from 'egg';
export default class OtherController extends Controller {
  /**
   * load qi-niu upload token
   */
  async getQiniuUploadToken() {
    const { ctx, app } = this;
    const uploadToken = await app['qiniu'].getuploadToken();
    ctx.status = 200;
    ctx.body = { uploadToken };
  }

  /**
   * just for test
   */
  async test() {
    const { ctx, app } = this;
    const key = 'rate.png';
    const msg = await app['qiniu'].publicDownloadUrl(
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
    const msg = await app['qiniu'].putFile(key, localFile);
    ctx.status = 200;
    ctx.body = msg;
  }
}
