module.exports = function generateActions(model) {
  return {
    findAll: async function(ctx, next) {
      try {
        let conditions = {};
        let select = {};
        let query = ctx.request.query;

        if (query.conditions) {
          conditions = JSON.parse(query.conditions);
        }

        // 按用户筛选
        if (ctx.request.currentUser) {
          conditions.userid = ctx.request.currentUser.username;
        }
        let builder = model.find(conditions);
        if (query.select) {
          select = JSON.parse(query.select);
          builder = builder.select(select);
        }

        ["limit", "skip", "sort", "count"].forEach(key => {
          if (query[key]) {
            let arg = query[key];
            if (key === "limit" || key === "skip") {
              arg = parseInt(arg);
            }
            if (key === "sort" && typeof arg === "string") {
              arg = JSON.parse(arg);
            }
            if (key !== "count") builder[key](arg);
            else builder[key]();
          }
        });
        const result = await builder.exec();
        return (ctx.body = result);
      } catch (error) {
        return (ctx.body = error);
      }
    },

    findById: async function(ctx, next) {
      try {
        let select = {};
        let query = ctx.request.query;
        let builder = model.findById(ctx.params.id);
        if (query.select) {
          select = JSON.parse(query.select);
          builder = builder.select(select);
        }
        const result = await builder.exec();

        return (ctx.body = result);
      } catch (error) {
        return (ctx.body = error);
      }
    },

    deleteById: async function(ctx, next) {
      try {
        const result = await model.findByIdAndRemove(ctx.params.id).exec();
        return (ctx.body = result);
      } catch (error) {
        return (ctx.body = error);
      }
    },

    replaceById: async function(ctx, next) {
      try {
        await model.findByIdAndRemove(ctx.params.id).exec();
        const newDocument = ctx.request.body;
        newDocument._id = ctx.params.id;
        const result = await model.create(newDocument);
        return (ctx.body = result);
      } catch (error) {
        return (ctx.body = error);
      }
    },

    updateById: async function(ctx, next) {
      try {
        const result = await model
          .findByIdAndUpdate(ctx.params.id, ctx.request.body, {
            new: true
          })
          .exec();
        return (ctx.body = result);
      } catch (error) {
        return (ctx.body = error);
      }
    },

    create: async function(ctx, next) {
      try {
        // 存储用户编号/username
        if (ctx.request.currentUser) {
          ctx.request.body.userid = ctx.request.currentUser.username;
        }
        const result = await model.create(ctx.request.body);
        ctx.status = 201;
        return (ctx.body = result);
      } catch (error) {
        return (ctx.body = error);
      }
    }
  };
};
