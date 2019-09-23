const router = require('koa-router')()
// 引入鉴权工具 koa-passport
const passport = require('koa-passport')
const Daily = require('../models/DailyModel')
const User = require('../models/UserModel')
const DailyComment = require('../models/DailyCommentModel')
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

/**
 * @router POST /daily/comment
 * @description 发表评论
 * @access private
 */
router.post('/comment', passport.authenticate('jwt', {session:false}), async ctx => {
  const {dailyId, content, userId, replyTo} = ctx.request.body
  // 如果没有评论内容
  if (!content) {
    ctx.body = {
      success: false,
      msg: 'empty content'
    }
    return
  }
  const daily = await Daily.findOne({
    where: {
      id: dailyId
    }
  })
  // 如果没有这条动态
  if (!daily) {
    ctx.body = {
      success: false,
      msg: 'daily doesnt exist'
    }
    return
  }
  // 为用户发送提醒
  let user
  if (!replyTo) {
    user = await User.findOne({
      where: {
        id: daily.userId
      }
    })
  } else {
    user = await User.findOne({
      where: {
        id: replyTo
      }
    })
  }
  // 增加提醒数目
  await user.update({
    dailyNotice: user.dailyNotice+1
  })
  var params = {
    commentAt: new Date().getTime(),
    dailyId,
    content, 
    userId,
    replyTo: !replyTo?0:replyTo
  }
  console.log(params)
  const createComment = DailyComment.create(params)
  if (createComment) {
    ctx.status = 200
    ctx.body = {
      msg: 'create daily comment success',
      success: true
    }
  }
})
/**
 * @router GET /daily/getComment
 * @description 获取某条动态的全部评论
 * @access public
 */
router.get('/getComment', async ctx => {
  const id = ctx.query.id
  const comments = await DailyComment.findAll({
    where: {
      dailyId: id,
      delete: 1
    },
    include: [
      {
        model: User,
        as: 'userInfo',
        attributes: ['name']
      },{
        model: User,
        as: 'reply',
        attributes: ['name']
      }
    ],
    // 根据更新时间降序查找，最新动态在上面
    order: [
      ['commentAt', 'DESC']
    ],
  })
  if (comments.length > 0) {
    ctx.body = {
      success: true,
      comments
    }
  } else {
    ctx.body = {
      success: false,
      msg: 'no comment'
    }
  }
})

/**
 * @router GET /daily/deleteComment
 * @description 删除一条评论
 * @access private
 */
router.get('/deleteComment', passport.authenticate('jwt', {session:false}),async ctx => {
  const id = ctx.query.id
  console.log(id)
  const comment = await DailyComment.findOne({
    where: {
      id
    }
  })
  console.log(comment)
  if (comment) {
    const deleteComment = await comment.update({
      delete: 0
    })
    if (deleteComment) {
      ctx.body = {
        success: true
      }
    }
  }
})

module.exports = router.routes()
