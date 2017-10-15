// app/controller/home.js
module.exports = app => {
    class HomeController extends app.Controller {
      * index() {
        this.ctx.body = 'Hello, this is TomatoBang Index Page';
      }
    }
    return HomeController;
  };