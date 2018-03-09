'use strict';
const Controller = require('egg').Controller;
class OtherController extends Controller {
  /**
   * 下载音频文件
   * 通过 query 参数获取相关内容
   */
  async downloadVoiceFile() {
    const { ctx } = this;
    const send = require('koa-send');
    if (!ctx.request.currentUser) {
      ctx.status = 500;
      ctx.body = '请先登录!!!';
      return;
    }
    const relateUrl = ctx.params.path;
    const savePath = '/uploadfile/voices/' + relateUrl;
    // 默认会加上本服务器地址
    await send(ctx, savePath);
  }

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
    // const localFile = 'D:\/rate.png';
    const key = 'rate.png';
    // (respErr, respBody, respInfo) => {
    //   if (respErr) {
    //     reject(respErr);
    //   }
    //   if (respInfo.statusCode === 200) {
    //     resolve(respBody);
    //   } else {
    //     console.log(respInfo.statusCode);
    //     resolve(respBody);
    //   }
    // }
    // { respErr, respBody, respInfo }
    // const msg = await app.qiniu.putFile(key, localFile);
    // const msg = await app.qiniu.putFile(key, localFile);
    const msg = await app.qiniu.publicDownloadUrl(
      key,
      'http://osv2a938x.bkt.clouddn.com'
    );
    ctx.status = 200;
    ctx.body = msg;
  }
}
module.exports = OtherController;
