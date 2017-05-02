let config = require('../conf/config')
let mongoose = require('mongoose')
let log = require('../utils/log')

mongoose.Promise = require('bluebird')

let mongoUrl = `${config.mongoHost}:${config.mongoPort}/${config.mongoDatabase}`

mongoose.connect(mongoUrl)

let db = mongoose.connection

db.on('error', (err) => {
  log.error('connect error:', err)
})

db.once('open', () => {
  log.info('MongoDB is ready')
})

const Schema = mongoose.Schema

let task = new Schema({
  // 用户编号
  userid:String,
  // 标题
  title: String,
  // 描述
  description: { type: String, default: '' },
  // 番茄个数
  num:{ type: Number, default: 0 },
  // 是否激活
  isActive:{ type:boolean, default:false}
});


let tomato = new Schema({
  // 用户编号
  userid:String,
  // 开始时间
  startTime: { type: String, default: '' },
  // 结束时间
  endTime: { type: String, default: '' },
  // 标题
  title: String,
  // 描述
  description: { type: String, default: '' },
  // 任务编号，可空
  taskid:{ type: String },

})

/**
 * 用户
 */
let user = new Schema({
  // 用户名
  username: String,
  // 密码
  password: String,
  // 显示名称
  displayName: String,
  // 邮箱
  email: String
})

/**
 * 网站说明
 */
let option = new Schema({
  // 键
  key: String,
  // 值
  value: Schema.Types.Mixed,
  // 描述
  desc: String
})

task = mongoose.model('task', task)
tomato = mongoose.model('tomato', tomato)
user = mongoose.model('user', user)
option = mongoose.model('option', option)

module.exports = {
  task,
  tomato,
  user,
  option
}
