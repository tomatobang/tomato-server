'use strict';
const bcrypt = require('bcryptjs');
import BaseController from './base';
import {
  userValidationRule,
  loginValidationRule,
  emailUserNameValidationRule,
  emailValidationRule,
  sexValidationRule,
} from '../validate/user';

export default class UserController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.service = ctx.service.user;
    this.validateRule = userValidationRule;
  }

  /**
   * search user by keyword
   */
  async searchUsers() {
    const { ctx } = this;
    const query = ctx.request.query;
    const keyword = query.keyword;
    console.log('keyword', keyword);
    const users = await this.service.findAll(
      {},
      {
        $or: [
          { username: keyword },
          { displayName: keyword },
          { bio: keyword },
        ],
        deleted: false,
      }
    );
    ctx.body = users;
  }

  /**
   * to see is user has login
   */
  async auth() {
    const { ctx } = this;
    if (ctx.request['currentUser']) {
      ctx.body = {
        status: true,
      };
    } else {
      ctx.body = {
        status: false,
        description: 'toekn expiration!',
      };
    }
  }

  /**
   * login
   */
  async login() {
    const { ctx, app } = this;
    const invalid = app['validator'].validate(
      loginValidationRule,
      ctx.request.body
    );
    if (invalid) {
      ctx.body = {
        status: 'fail',
        description: '请求参数错误！',
      };
      return;
    }
    const users = await ctx.service.user.findAll(
      {},
      { username: ctx.request.body.username }
    );
    if (users.length === 0) {
      ctx.body = {
        status: 'fail',
        description: '用户不存在',
      };
      return;
    }
    const user = {
      _id: users[0]._id,
      username: users[0].username,
      timestamp: new Date().valueOf(),
    };
    const password = users[0].password;
    const verifyPWD = await users[0].comparePassword(ctx.request.body.password);
    if (password === ctx.request.body.password || verifyPWD) {
      const token = app['util'].jwt.tokenService.createToken(user);
      ctx.logger.info(user, token);
      await app['redis'].set(
        token,
        JSON.stringify(user),
        'EX',
        3 * 24 * 60 * 60
      );
      ctx.body = {
        status: 'success',
        token,
        userinfo: {
          _id: users[0]._id,
          username: users[0].username,
          displayName: users[0].displayName,
          bio: users[0].bio,
          img: users[0].img,
          email: users[0].email,
          sex: users[0].sex,
          location: users[0].location,
          level: users[0].level,
        },
      };
    } else {
      ctx.body = {
        status: 'fail',
        description: 'Get token failed. Check the password',
      };
    }
  }

  /**
   * logout
   */
  async logout() {
    const { ctx, app } = this;
    const headers = ctx.request.headers;
    const token = headers.authorization;
    await app['redis'].del(token);
    ctx.body = {
      status: 'success',
      description: 'logout succeed',
    };
  }

  /**
   * change password
   */
  async changePWD() {
    const { ctx, app } = this;
    const userid = ctx.request['currentUser']._id;
    const oldPassword = ctx.request.body.oldPassword;
    let newPassword = ctx.request.body.newPassword;
    console.log(ctx.request.body);
    if (oldPassword === newPassword) {
      ctx.status = 200;
      ctx.body = {
        status: 'fail',
        description: '新旧密码一致!',
      };
      return;
    }

    const users = await ctx.service.user.findAll(
      {},
      { _id: app.mongoose.Types.ObjectId(userid) }
    );
    if (users.length === 0) {
      ctx.status = 200;
      ctx.body = {
        status: 'fail',
        description: '用户不存在',
      };
      return;
    }

    const password = users[0].password;
    const verifyPWD = await users[0].comparePassword(oldPassword);
    if (password === oldPassword || verifyPWD) {
      newPassword = await bcrypt.hash(newPassword, 10);
      await this.service.updatePWD(users[0]._id, newPassword);
      ctx.status = 200;
      ctx.body = {
        success: true,
        msg: '密码修改成功',
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        status: 'fail',
        description: '旧密码输入错误!',
      };
    }
  }

  /**
   * validate username and email
   */
  async emailUserNameVerify() {
    const { ctx, app } = this;
    const invalid = app['validator'].validate(
      emailUserNameValidationRule,
      ctx.request.body
    );
    if (invalid) {
      ctx.body = {
        status: 'fail',
        description: '请求参数错误！',
      };
      return;
    }

    const email = ctx.request.body.email;
    const username = ctx.request.body.username;
    const {
      emailRet,
      usernameRet,
    } = await ctx.service.user.emailUserNameVerify(email, username);

    if (emailRet.length) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: '邮箱已存在！',
      };
    } else if (usernameRet.length) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        msg: '用户名已存在！',
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        success: true,
        msg: '邮箱可用！',
      };
    }
  }

  /**
   * update head image( file url )
   */
  async updateHeadImg() {
    const { ctx } = this;
    const userid = ctx.request['currentUser']._id;
    const filename = ctx.request.body.filename;
    await ctx.service.user.updateHeadImg(userid, filename);
    ctx.status = 200;
    ctx.body = {
      success: true,
      msg: '保存成功！',
    };
  }

  /**
   * update sex info
   */
  async updateSex() {
    const { ctx, app } = this;
    const invalid = app['validator'].validate(
      sexValidationRule,
      ctx.request.body
    );
    if (invalid) {
      ctx.body = {
        status: 'fail',
        description: '请求参数错误！',
      };
      return;
    }
    const id = ctx.request['currentUser']._id;
    const sex = ctx.request.body.sex;
    const result = await ctx.service.user.updateSex(id, sex);
    ctx.body = result;
  }

  /**
   * update nick name
   */
  async updateDisplayName() {
    const { ctx } = this;
    const id = ctx.request['currentUser']._id;
    const displayname = ctx.request.body.displayname;
    const result = await ctx.service.user.updateDisplayName(id, displayname);
    ctx.body = result;
  }

  /**
   * update email
   */
  async updateEmail() {
    const { ctx, app } = this;
    const invalid = app['validator'].validate(
      emailValidationRule,
      ctx.request.body
    );
    if (invalid) {
      ctx.body = {
        status: 'fail',
        description: '请求参数错误！',
      };
      return;
    }

    const id = ctx.request['currentUser']._id;
    const email = ctx.request.body.email;
    const result = await ctx.service.user.updateEmail(id, email);
    ctx.body = result;
  }

  /**
   * update position
   */
  async updateLocation() {
    const { ctx } = this;
    const id = ctx.request['currentUser']._id;
    const location = ctx.request.body.location;
    const result = await ctx.service.user.updateLocation(id, location);
    ctx.body = result;
  }

  /**
   * update bio
   */
  async updateBio() {
    const { ctx } = this;
    const id = ctx.request['currentUser']._id;
    const bio = ctx.request.body.bio;
    const result = await ctx.service.user.updateBio(id, bio);
    ctx.body = result;
  }
}
