/**
 * 接口请求前验证
 */
const redis = require('../../model/redis')
const tokenService = require('../../service/token')

module.exports = class {
  async beforeRestful(ctx, next) {
    // 临时默认验证通过
    // return next();

    const isGettingUser = ctx.url.startsWith('/api/user')
    // 以 api 开头的 POST 请求
    const isNotGet = ctx.url.startsWith('/api/') && ctx.method !== 'GET'
    // GET 请求 且 不是获取用户的 GET 请求
    if (!isGettingUser && !isNotGet) {
      return next()
    }

    const headers = ctx.request.headers
    let token
    try {
      token = headers['authorization']
    } catch (err) {
      return ctx.body = {
        status: 'fail',
        description: err
      }
    }

    if (!token) {
      return ctx.body = {
        status: 'fail',
        description: 'Token not found'
      }
    }

    const result = tokenService.verifyToken(token)
    if (result === false) {
      return ctx.body = {
        status: 'fail',
        description: 'Token verify failed'
      }
    }

    let reply = await redis.getAsync('token')

    if (reply === token) {
      return next()
    } else {
      return ctx.body = {
        status: 'fail',
        description: 'Token invalid'
      }
    }
  }
}
