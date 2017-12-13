'use strict';

const Service = require('egg').Service;

class UserService extends Service {

    async emailUserNameVerify(email, username) {
        const model = this.ctx.model.User;
        const emailRet = await model.find({ email }).exec();
        const usernameRet = await model.find({ username }).exec();
        return {
            emailRet,
            usernameRet,
        };
    }


    async findAll(query, conditions) {
        const model = this.ctx.model.User;
        if (conditions) {
            if (!conditions.deleted) {
                conditions.deleted = false;
            }
        }
        let builder = model.find(conditions);
        if (query.select) {
            const select = JSON.parse(query.select);
            builder = builder.select(select);
        }

        [ 'limit', 'skip', 'sort', 'count' ].forEach(key => {
            if (query[key]) {
                let arg = query[key];
                if (key === 'limit' || key === 'skip') {
                    arg = parseInt(arg);
                }
                if (key === 'sort' && typeof arg === 'string') {
                    arg = JSON.parse(arg);
                }
                if (key !== 'count') builder[key](arg);
                else builder[key]();
            }
        });
        const result = await builder.exec();
        return result;
    }

    async findById(query, id) {
        const model = this.ctx.model.User;
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
        const model = this.ctx.model.User;
        const result = await model.create(body);
        return result;
    }

    async delete(id) {
        const model = this.ctx.model.User;
        await model.updateOne({ _id: id }, { deleted: true }, {});
        return true;
    }

    async updateById(id, body) {
        const model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, body, {
                new: true,
            })
            .exec();
        return result;
    }


    async updateHeadImg(id, imgurl) {
        const model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                img: imgurl,
            }, { new: true })
            .exec();
        return result;
    }

    async replaceById(id, newDocument) {
        const model = await this.ctx.model.User;
        await model.findByIdAndRemove(id).exec();
        const result = await model.create(newDocument);
        return result;
    }

    async UpdateSex(id, sex) {
        const model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                sex,
            }, { new: true })
            .exec();
        return result;
    }
    async UpdateDisplayName(id, displayName) {
        const model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                displayName,
            }, { new: true })
            .exec();
        return result;
    }

    async UpdateEmail(id, email) {
        const model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                email,
            }, { new: true })
            .exec();
        return result;
    }

    async UpdateLocation(id, location) {
        const model = this.ctx.model.User;
        const result = await model
            .findByIdAndUpdate(id, {
                location,
            }, { new: true })
            .exec();
        return result;
    }
}

module.exports = UserService;
