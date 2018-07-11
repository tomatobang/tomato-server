'use strict';
import BaseController from './base';
export default class VersionController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.version;
  }

  /**
   * find latest version info
   */
  async findLatestVersion() {
    const { ctx } = this;
    const LTSVersion = await ctx.service.version.findLatestVersion();
    ctx.status = 200;
    ctx.body = LTSVersion;
  }
}
