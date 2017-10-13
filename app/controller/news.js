// app/controller/news.js
module.exports = app => {
    class NewsController extends app.Controller {
      * list() {
        const ctx = this.ctx;
        const page = ctx.query.page || 1;
        const newsList = yield ctx.service.news.list(page);
        console.log("newsList",newsList);
        yield ctx.render('news/list.tpl', { list: newsList.data });
      }
    }
    return NewsController;
  };