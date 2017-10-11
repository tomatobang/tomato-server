// app/service/news.js
module.exports = app => {
    class NewsService extends app.Service {
      * list(page = 1) {
        // read config
        const { serverUrl, pageSize } = this.app.config.news;
        // use build-in http client to GET hacker-news api
        // {"success":true,"data":[{"_id":"5997aa11e8a5ef962b6c482e","begintime":null,"endtime":"1991-07-20T03:01:15.814Z",
        // "event":"我出生了","detail":"哈哈，回到最初的起点！","type":"生日","level":null,"cycle":"一次","isPrivate":false},
        // {"_id":"586de5b747e20ba13b092184","begintime":null,"endtime":"2013-08-12T06:19:13.264Z","event":"第一天工作",
        // "detail":"值得纪念的日子","type":"节点","level":5,"cycle":"一次","isPrivate":false}]}
        const { data: ret } = yield this.ctx.curl(`${serverUrl}`, {
          method: 'POST',
          data: {
            // orderBy: '"$key"',
            // projectCode:201,
            // startAt: `"${pageSize * (page - 1)}"`,
            // endAt: `"${pageSize * page - 1}"`,
          },
          dataType: 'json',
        });
        // parallel GET detail, see `yield {}` from co
        // const newsList = yield Object.keys(ret).map(key => {
        //   return this.ctx.curl(url, { dataType: 'json' });
        // });
        // return newsList.map(res => res.data);
       
        return ret;
      }
    }
    return NewsService;
  };