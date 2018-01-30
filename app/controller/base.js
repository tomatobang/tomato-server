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
      const invalid = app.validator.validate(
        this.validateRule,
        ctx.request.body
      );
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

  /**
   * 关键词查找
   */
  async pagination() {
    const { ctx } = this;
    const current = ctx.request.body.current;
    let userid = '';
    if (ctx.request.currentUser) {
      userid = ctx.request.currentUser.username;
    }
    if (!this.select_field) {
      ctx.status = 403;
      ctx.body = {
        error_msg: '暂不支持分页!',
      };
      return;
    }
    if (!current || current < 1) {
      ctx.status = 403;
      ctx.body = {
        error_msg: 'current 参数格式不正确!',
      };
      return;
    }
    const ret = await ctx.service.tomato.loadByPagination(
      {
        current,
        userid,
        pageSize: 6,
        sorter: {
          startTime: -1,
        },
      },
      this.select_field
    );
    ctx.status = 200;
    ctx.body = ret;
  }

  /**
   * 统一错误处理
   * @param {*} type 错误类型
   * @param {*} message 错误消息
   */
  async throwBizError(type, message) {
    if (type === 'DB:ERR') {
      throw new Error('发生了数据库错误');
    }
    if (type === 'FILE:ERR') {
      throw new Error('发生了文件类型错误');
    } else {
      throw new Error(message);
    }
  }
}

module.exports = BaseController;
