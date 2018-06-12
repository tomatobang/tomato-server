'use strict';
import BaseController from './base';
export default class VersionController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.version;
  }

  /**
   * 查找最新版本信息
   */
  async findLatestVersion() {
    const { ctx } = this;
    const LTSVersion = await ctx.service.version.findLatestVersion();
    ctx.status = 200;
    ctx.body = LTSVersion;
  }
}
