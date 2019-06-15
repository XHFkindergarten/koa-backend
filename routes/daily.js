const router = require('koa-router')()
// 引入鉴权工具 koa-passport
const passport = require('koa-passport')
const Daily = require('../models/DailyModel')
const User = require('../models/UserModel')
const Utils = require('../tool/utils')
const config = require('../config/default')

router.get('/', (ctx, next) => {
  ctx.body = {
    msg: 'Hello'
  }
})

/**
 * @router POST /daily/addDaily
 * @description 增加日常
 * @access private
 */
router.post('/addDaily', passport.authenticate('jwt', {session:false}), async ctx => {
  const createdAt = new Date().getTime()
  const createDaily = await Daily.create({
    ...ctx.request.body,
    createdAt
  })
  if (createDaily) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'create daily success'
    }
  }
})

/**
 * @router GET /daily/getAll
 * @description 根据条件获取daily数组
 * @params offset
 * @params userId
 * @access public
 */
router.get('/getAll', async ctx => {
  const offset = parseInt(ctx.query.offset) || 0
  // 查询参数
  let params = {
    include: {
      model: User,
      as: 'userInfo'
    },
    // 根据更新时间降序查找，最新动态在上面
    order: [
      ['createdAt', 'DESC']
    ],
    offset: offset * config.dailySize,
    limit: config.dailySize,
  }
  const userId = ctx.query.userId
  if (userId) {
    params.where = {
      userId: parseInt(userId)
    }
  }
  console.log(params)
  const daily = await Daily.findAll(params)
  if (daily.length>0) {
    ctx.status = 200
    ctx.body = {
      success: true,
      daily
    }
    return
  } else {
    ctx.status = 200
    ctx.body = {
      success: false,
      msg: 'no daily'
    }
  }
})

/**
 * @router GET /daily/deleteOne
 * @description 根据id删除动态
 * @access private
 */
router.get('/deleteOne', passport.authenticate('jwt', {session:false}), async ctx => {
  const id = ctx.query.id
  const res = await Daily.destroy({
    where: {
      id
    }
  })
  if (res) {
    ctx.status = 200
    ctx.body = {
      success: true
    }
  }
})

module.exports = router.routes()
