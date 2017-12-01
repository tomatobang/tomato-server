const Service = require('egg').Service;
class TomatoService extends Service {
    async statistics(userid, startTime, endDate, succeed) {
        let Tomato = this.ctx.model.Tomato;
        
        let res = await Tomato.aggregate([
            {
                $match: {
                    "userid": userid,
                    "succeed": parseInt(succeed),
                    "startTime": { "$gte": new Date(startTime), "$lte": new Date(endDate) }
                }
            },
            {
                $project: {
                    // 校准日期并格式化
                    startTime: { $substr: [{ "$add": ["$startTime", 28800000] }, 0, 10] },
                    succeed: 1
                },
            },
            {
                $group: {
                    _id: "$startTime",
                    count: { $sum: 1 },
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        return res;
    }

    async findAll(query, conditions) {
        let model = this.ctx.model.Tomato;
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
        let model = this.ctx.model.Tomato;
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
        let model = this.ctx.model.Tomato;
        const result = await model.create(body);
        return result;
    }

    async delete(id) {
        let model = this.ctx.model.Tomato;
        const result = await model.findByIdAndRemove(id).exec();
        return result;
    }

    async updateById(id, body) {
        let model = await this.ctx.model.Tomato;
        const result = await model
            .findByIdAndUpdate(id, body, {
                new: true
            })
            .exec();
        return result;
    }

    async updateById(id, body) {
        let model = this.ctx.model.Tomato;
        const result = await model
            .findByIdAndUpdate(id, body, {
                new: true
            })
            .exec();
        return result;
    }

    async replaceById(id, newDocument) {
        let model = this.ctx.model.Tomato;
        await model.findByIdAndRemove(id).exec();
        const result = await model.create(newDocument);
        return result;
    }
}
module.exports = TomatoService;