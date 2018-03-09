'use strict';

/**
 * 消息服务
 */

module.exports = app => {
  class Controller extends app.Controller {
    async connection() {
      return;
    }

    async init() {
      return;
    }

    async sendMessage() {
      return;
    }

    async disconnect() {
      return;
    }
  }
  return Controller;
};
