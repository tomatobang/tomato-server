'use strict';
const Controller = require('egg').Controller;
class BaseController extends Controller {
  /**
   * 按条件查找
   */
  async list() {
    const { ctx } = this;
    let conditions = {};
    const query = ctx.request.query;
    // 按用户筛选
    if (ctx.request.currentUser) {
      conditions.userid = ctx.request.currentUser.username;
    }
    if (query.conditions) {
      conditions = JSON.parse(query.conditions);
    }
    const result = await this.service.findAll(query, conditions);
    ctx.logger.info('message', result);

    // 设置响应体和状态码
    ctx.body = result;
    ctx.status = 200;
  }

  /**
   * 按 id 查找
   */
  async findById() {
    const { ctx } = this;
    const query = ctx.request.query;
    const id = ctx.params.id;
    const result = await this.service.findById(query, id);
    ctx.body = result;
  }

  /**
   * 创建
   */
  async create() {
    const { ctx, app } = this;
    // 存储用户编号/username
    if (ctx.request.currentUser) {
      ctx.request.body.userid = ctx.request.currentUser.username;
    }
    if (this.validateRule) {
      const invalid = app.validator.validate(this.validateRule, ctx.request.body);
      if (invalid) {
        ctx.throw(400);
      }
    }
    const result = await this.service.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = result;
  }

  /**
   * 删除
   */
  async deleteById() {
    const { ctx } = this;
    const id = ctx.params.id;
    const result = await this.service.delete(id);
    ctx.body = result;
  }

  /**
   * 按 id 更新
   */
  async updateById() {
    const { ctx } = this;
    const id = ctx.params.id;
    const body = ctx.request.body;
    const result = await this.service.updateById(id, body);
    ctx.body = result;
  }

  /**
   * 按 id 替换
   */
  async replaceById() {
    const { ctx } = this;
    const newDocument = ctx.request.body;
    const id = ctx.params.id;
    newDocument._id = id;
    const result = await this.service.replaceById(id, newDocument);
    ctx.body = result;
  }
}

module.exports = BaseController;
