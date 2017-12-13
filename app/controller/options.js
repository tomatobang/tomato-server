'use strict';
const BaseController = require('./base');
class OptionsController extends BaseController {
    constructor(ctx) {
        super(ctx);
        this.service = ctx.service.option;
      }
}
module.exports = OptionsController;
