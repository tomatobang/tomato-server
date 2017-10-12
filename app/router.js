// app/router.js
module.exports = app => {
    // 这两个接口用于测试
    app.get('/', app.controller.home.index);
    app.get('/news', app.controller.news.list);

    app.get('/api/user', app.controller.user.list);
    app.get('/api/user/:id', app.controller.user.findById);
    app.post('/api/user', app.controller.user.create);
    app.post('/api/user/:id', app.controller.user.updateById);
    app.del('/api/user/:id', app.controller.user.deleteById);
    //app.put('/api/user', app.controller.user.create);
    //app.put('/api/user/:id', app.controller.user.replaceById);
    //app.patch('/api/user/:id', app.controller.user.updateById);

    app.get('/api/tomato', app.controller.tomato.list);
    app.get('/api/tomato/:id', app.controller.tomato.findById);
    app.post('/api/tomato', app.controller.tomato.create);
    app.post('/api/tomato/:id', app.controller.tomato.updateById);
    app.del('/api/tomato/:id', app.controller.tomato.deleteById);


    app.get('/api/task', app.controller.task.list);
    app.get('/api/task/:id', app.controller.task.findById);
    app.post('/api/task', app.controller.task.create);
    app.post('/api/task/:id', app.controller.task.updateById);
    app.del('/api/task/:id', app.controller.task.deleteById);


    app.get('/api/options', app.controller.options.list);
   
   
  };