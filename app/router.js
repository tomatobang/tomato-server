// app/router.js
module.exports = app => {
    app.get('/', app.controller.home.index);
  };