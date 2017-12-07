const Service = require('egg').Service;

class UserService extends Service {

    async emailUserNameVerify(email, username) {
        let model = this.ctx.model.User;
        let emailRet = await model.find({ email: email }).exec();
        let usernameRet = await model.find({ username: username }).exec();
        return {
            emailRet,
            usernameRet
        }
    }


    async findAll(query, conditions) {
        let model = this.ctx.model.User;
        if (conditions) {
            if (!conditions.deleted) {
                conditions.deleted = false;
            }
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
        let model = this.ctx.model.User;
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
        let model = this.ctx.model.User;
        const result = await model.create(body);
        return result;
    }

    async delete(id) {
        let model = this.ctx.model.User;
        await model.updateOne({ _id: id }, { deleted: true }, {});
        return true;
    }

    async updateById(id, body) {
        let model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, body, {
                new: true
            })
            .exec();
        return result;
    }


    async updateHeadImg(id, imgurl) {
        let model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                img: imgurl
            }, { new: true })
            .exec();
        return result;
    }

    async replaceById(id, newDocument) {
        let model = await this.ctx.model.User;
        await model.findByIdAndRemove(id).exec();
        const result = await model.create(newDocument);
        return result;
    }

    async UpdateSex(id, sex) {
        let model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                sex: sex
            }, { new: true })
            .exec();
        return result;
    }
    async UpdateDisplayName(id, displayName) {
        let model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                displayName: displayName
            }, { new: true })
            .exec();
        return result;
    }

    async UpdateEmail(id, email) {
        let model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                email: email
            }, { new: true })
            .exec();
        return result;
    }

    async UpdateLocation(id, location) {
        let model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                location: location
            }, { new: true })
            .exec();
        return result;
    }
}

module.exports = UserService;