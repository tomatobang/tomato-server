// app/service/news.js
module.exports = app => {
    class NewsService extends app.Service {
      async  list(page = 1) {
        // read config
        const { serverUrl, pageSize } = this.app.config.news;
        // use build-in http client to GET hacker-news api
        const { data: ret } = await this.ctx.curl(`${serverUrl}`, {
          method: 'POST',
          data: {
            // orderBy: '"$key"',
          },
          dataType: 'json',
        });
        return ret;
      }
    }
    return NewsService;
  };