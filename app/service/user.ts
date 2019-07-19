'use strict';

import BaseService from './base';

export default class UserService extends BaseService {
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

  async hasUser(userid) {
    const model = this.ctx.model.User;
    const ret = await model.findOne({ _id: userid }).exec();
    if (ret) {
      return true;
    }
    return false;
  }

  async updatePWD(id, new_password) {
    const model = this.ctx.model.User;
    const result = await model
      .findByIdAndUpdate(
        id,
        {
          $set: { password: new_password },
        },
        {
          new: true,
        }
      )
      .exec();
    return result;
  }

  async updateHeadImg(id, imgurl) {
    const model = this.ctx.model.User;
    const result = await model
      .findByIdAndUpdate(
        id,
        {
          $set: { img: imgurl },
        },
        {
          new: true,
        }
      )
      .exec();
    return result;
  }

  async updateSex(id, sex) {
    const model = this.ctx.model.User;
    const result = await model
      .findByIdAndUpdate(
        id,
        {
          $set: { sex },
        },
        {
          new: true,
        }
      )
      .exec();
    return result;
  }

  async updateDisplayName(id, displayName) {
    const model = this.ctx.model.User;
    const result = await model
      .findByIdAndUpdate(
        id,
        {
          $set: { displayName },
        },
        {
          new: true,
        }
      )
      .exec();
    return result;
  }

  async updateEmail(id, email) {
    const model = this.ctx.model.User;
    const result = await model
      .findByIdAndUpdate(
        id,
        {
          $set: { email },
        },
        {
          new: true,
        }
      )
      .exec();
    return result;
  }

  async updateLocation(id, location) {
    const model = this.ctx.model.User;
    const result = await model
      .findByIdAndUpdate(
        id,
        {
          $set: { location },
        },
        {
          new: true,
        }
      )
      .exec();
    return result;
  }

  async updateBio(id, bio) {
    const model = this.ctx.model.User;
    const result = await model
      .findByIdAndUpdate(
        id,
        {
          $set: { bio },
        },
        {
          new: true,
        }
      )
      .exec();
    return result;
  }
}
