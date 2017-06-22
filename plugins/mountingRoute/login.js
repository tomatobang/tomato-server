const redis = require('../../model/redis')
const tokenService = require('../../service/token')
const { user: model } = require('../../model/mongo')

module.exports = class {
  async mountingRoute() {
    return {
      method: 'post',
      path: '/api/login',
      middleware: [middleware]
    }
  }
}

async function middleware(ctx, next) {
  let users, user

  try {
    users = await model.find({ username: ctx.request.body.username }).exec()
    user = {
      username: users[0].username,
      timestamp: (new Date()).valueOf()
    }

    let password = users[0].password

    if (password === ctx.request.body.password) {
      let token = tokenService.createToken(user)

      redis.set('token', token, 'EX', tokenService.expiresIn, () => {

      })

      return ctx.body = {
        status: 'success',
        token: token
      }
    } else {
      return ctx.body = {
        status: 'fail',
        description: 'Get token failed. Check the password'
      }
    }
  } catch (_error) {
    return ctx.body = {
      status: 'fail',
      description: 'Get token failed. Check the name'
    }
  }
}
