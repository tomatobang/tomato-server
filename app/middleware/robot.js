// app/middleware/robot.js
// options === app.config.robot
module.exports = (options, app) => {
    return function* robotMiddleware(next) {
      const source = this.get('user-agent') || '';
      const match = options.ua.some(ua => ua.test(source));
      if (match) {
        this.status = 403;
        this.message = 'Go away, robot.';
      } else {
        yield next;
      }
    }
  };
  // config/config.default.js
  // add middleware robot
  exports.middleware = [
    'robot'
  ];
  // robot's configurations
  exports.robot = {
    ua: [
      /Baiduspider/i,
    ]
  };