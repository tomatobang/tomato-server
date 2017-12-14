'use strict';

const BaseService = require('./base');

class UserService extends BaseService {

    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.User;
    }

    async emailUserNameVerify(email, username) {
        const model = this.ctx.model.User;
        const emailRet = await model.find({ email }).exec();
        const usernameRet = await model.find({ username }).exec();
        return {
            emailRet,
            usernameRet,
        };
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
