'use strict';
const Controller = require('egg').Controller;
class HomeController extends Controller {
  async index() {
    this.ctx.body = 'Hello, this is TomatoBang Index Page';
  }
}
module.exports = HomeController;
