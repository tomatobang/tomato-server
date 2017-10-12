module.exports = app => {
    class UserService extends app.Service {
        async findAll(query, conditions) {
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
            return result;
        }

        async findById(query, id) {
            let select = {};
            let builder = model.findById(id);
            if (query.select) {
                select = JSON.parse(query.select);
                builder = builder.select(select);
            }
            const result = await builder.exec();
            return result;
        }

        async create(body) {
            const result = await model.create(ctx.request.body);
            return result;
        }

        async delete(id) {
            const result = await model.findByIdAndRemove(id).exec();
            return result;
        }

        async updateById(id, body) {
            const result = await model
                .findByIdAndUpdate(id, body, {
                    new: true
                })
                .exec();
            return result;
        }

        async updateById(id, body) {
            const result = await model
                .findByIdAndUpdate(id, body, {
                    new: true
                })
                .exec();
            return result;
        }

        async replaceById(id, newDocument) {
            await model.findByIdAndRemove(id).exec();
            const result = await model.create(newDocument);
            return result;
        }
    }
    return UserService;
};