'use strict';

const path = require('path');
const egg = require('egg');
const EGG_PATH = Symbol.for('egg#eggPath');
const EGG_LOADER = Symbol.for('egg#eggLoader');

class TomatoBangAppWorkerLoader extends egg.AppWorkerLoader {
    load() {
      super.load();
      // 自己扩展
    }
  }

class Application extends egg.Application {
  get [EGG_PATH]() {
    // 返回 framework 路径
    return path.dirname(__dirname);
  }
  // 覆盖 Egg 的 Loader，启动时使用这个 Loader
  get [EGG_LOADER]() {
    return TomatoBangAppWorkerLoader;
  }
}

class Agent extends egg.Agent {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
}

// 覆盖了 Egg 的 Application
module.exports = Object.assign(egg, {
  Application,
  Agent,
});
