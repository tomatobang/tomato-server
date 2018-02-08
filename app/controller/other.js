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
   * 上传音频文件
   */
  async uploadVoiceFile() {
    const { ctx } = this;
    const formidable = require('formidable');
    const fs = require('fs');
    const path = require('path');
    const userid = ctx.request.currentUser._id;
    const form = new formidable.IncomingForm();
    await form.parse(ctx.req, async (err, fields, files) => {
      const taskid = fields.taskid;
      if (!taskid) {
        throw new Error('taskid为空！');
      }
      if (err) {
        throw err;
      }
      let file = files.files;
      ctx.logger.info(files.name);
      if (!file) {
        // 兼容 ionic file transfer 插件
        file = files.file;
      }
      if (!file) {
        // egg 做了定制？
        file = files.name;
      }
      const reader = fs.createReadStream(file.path);
      // 设置保存路径
      const rootDir = path.resolve(__dirname, '../../');
      const relateUrl =
        '/uploadfile/voices/' + (userid + '_' + taskid + '_' + file.name);
      const savePath = rootDir + relateUrl;
      const stream = fs.createWriteStream(savePath, {
        flags: 'w',
        defaultEncoding: 'utf8',
        fd: null,
        mode: 0o666,
        autoClose: true,
      });
      reader.pipe(stream);
      ctx.logger.info('uploading %s -> %s', file.name, stream.path);
      await ctx.service.task.updateVoiceUrl(taskid, relateUrl);
    });

    // 此处写法待重构
    ctx.status = 200;
    ctx.body = {
      success: true,
      msg: '上传成功',
    };
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
    const uploadToken = await app.qiniu.uploadToken();
    ctx.status = 200;
    ctx.body = uploadToken;
  }

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
