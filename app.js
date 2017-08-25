global.Promise = require("bluebird");

const log = require("./utils/log");
const Koa = require("koa");
const koaRouter = require("koa-router");
var cors = require("koa-cors");
const mongoRest = require("./mongoRest");
const models = require("./model/mongo");
const redis = require("./model/redis");
const config = require("./conf/config");

const configName = process.env.NODE_ENV === '"development"' ? "dev" : "prod";
const blogpackConfig = require(`./build/blogpack.${configName}.config`);
blogpackConfig.models = models;
blogpackConfig.redis = redis;
const Blogpack = require("./blogpack");
const lifecycle = (global.lifecycle = new Blogpack(blogpackConfig));

const app = new Koa();




/**
 * Router 封装
 */
// 一般路由
const indexRoute = require("./router/index");

// Restful 路由
const router = koaRouter();
app.use(cors());



app.use(require("koa-static")(__dirname + "/public"));
(async () => {
  try {
    await lifecycle.beforeUseRoutes({
      config: lifecycle.config,
      app,
      router,
      models,
      redis
    });

    const beforeRestfulRoutes = lifecycle.getBeforeRestfulRoutes();
    const afterRestfulRoutes = lifecycle.getAfterRestfulRoutes();

    const middlewareRoutes = await lifecycle.getMiddlewareRoutes();

    for (const item of middlewareRoutes) {
      const middlewares = [...item.middleware];
      item.needBeforeRoutes && middlewares.unshift(...beforeRestfulRoutes);
      item.needAfterRoutes && middlewares.push(...afterRestfulRoutes);

      router[item.method](item.path, ...middlewares);
    }

    Object.keys(models).map(name => models[name]).forEach(model => {
      // 生成 restful 路由
      // 路由，实体模型，前缀，中间件
      mongoRest(router, model, "/api", {
        beforeRestfulRoutes,
        afterRestfulRoutes
      });
    });

    indexRoute.init(router);
    app.use(router.routes());

    /**
     * 执行中间件
     */
    const beforeServerStartArr = lifecycle.getBeforeServerStartFuncs();

    for (const middleware of beforeServerStartArr) {
      await middleware();
    }

    let server=  app.listen(config.serverPort, () => {
      log.info(`Koa2 is running at ${config.serverPort}`);
    });

    /*
    * setup socket.io, and socket-session
    */
    //let server = require('http').Server(app.callback());
    // const socketIO = require('socket.io');
    // let io = socketIO(server);
    var io = require('socket.io').listen(server);

    // chat 监听事件
    const chatEvt = require('./chat.io');
    chatEvt(io);
  } catch (err) {
    log.error(err);
  }
})();


