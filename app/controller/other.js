'use strict';
const Controller = require('egg').Controller;
class OtherController extends Controller {
  /**
   * 解散群组（待删）
   */
  async dismissgroup() {
    const { ctx, app } = this;
    const userid = ctx.request.currentUser._id;
    const groupid = ctx.request.body.groupid;
    if (!userid || !groupid) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        msg: 'userid与groupid 必填！',
      };
      return;
    }
    ctx.logger.info('userid', userid);
    ctx.logger.info('groupid', groupid);
    const ret = await app.hepler.rongyunUtil.dissmissgroup(userid, groupid);
    ctx.logger.info('ret', ret);
    if (ret) {
      ctx.status = 200;
      ctx.body = {
        success: true,
        msg: '删除成功',
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        success: false,
        msg: '删除失败',
      };
    }
  }

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
