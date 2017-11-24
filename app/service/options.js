const Service = require('egg').Service;

class OptionsService extends Service {
    async findAll(query, conditions) {
        let model =  this.ctx.model.Options;
        let builder =  model.find(conditions);
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
}

module.exports = OptionsService;