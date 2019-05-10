// 新建路由实例
const Router = require('koa-router')
const router = new Router()
// 引入配置
const config = require('../config/default')
// 引用工具方法
const Utils = require('../tool/utils')
// 引入鉴权工具 koa-passport
const passport = require('koa-passport')

// 引入sequelize
const sequelize = require('../mysql/sequelize')

// 引入文章 Model
const Article = require('../models/ArticleModel')
// 引入文章分组 Model
const ArticleGroup = require('../models/ArticleGroupModel')
// 引入用户 Model
const User = require('../models/UserModel')
// 引入like Model
const Like = require('../models/LikeModel')
// 引入评论 Model
const Comment = require('../models/CommentModel')
// 引入回复 Model
const Reply = require('../models/ReplyModel')


/**
 * @router POST /comment/addComment
 * @description 评论一篇文章，也可以是回复别人的评论
 * @params userId 用户id
 * @params articleId  文章id
 * @params content 评论内容
 * @params replyTo(可选) 回复的用户的id
 * @access private
 */
router.post('/addComment', passport.authenticate('jwt', {session:false}),
 async ctx => {
  // 因为总是出错，所以使用sequelize的事务管理
  const res = await sequelize.transaction(async t => {
    const { userId, articleId, content, replyTo } = ctx.request.body
    const time = new Date().getTime()
    const createComment = await Comment.create({
      userId,
      articleId,
      content,
      time,
      replyTo
    }, t)
    const article = await Article.findOne({
      where: {
        id: articleId
      }
    }, t)
    const saveArticle = await article.update({
      commentNum: article.commentNum+1
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'add comment success'
    }
  }).catch(err => {
    ctx.status = 400
  })
 })


/**
 * @router GET /comment/getComment
 * @description 按照时间获取某篇文章的所有评论
 * @params articleId 文章id
 * @access public
 */
router.get('/getComment', async ctx => {
  const articleId = ctx.query.articleId
  const res = await Comment.findAll({
    where: {
      articleId
    },
    include: {
      model: User,
      as: 'from'
    },
    // 根据更新时间降序查找，最新评论在上面
    order: [
      ['time', 'DESC']
    ]
  })
  if (res) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'get comment success',
      comment: res
    }
    return
  }
  ctx.status = 400
})

/**
 * @router POST /comment/addReply
 * @description 提交回复
 * @params userId 用户id
 * @params articleId 文章id
 * @params commentId 评论id
 * @params content 内容
 * @access private
 */
router.post('/addReply', passport.authenticate('jwt', {session:false}), async ctx => {
  const res = await sequelize.transaction(async t => {
    const {userId, articleId, commentId, content} = ctx.request.body
    const time = new Date().getTime()
    const addReply = await Reply.create({
      userId,
      articleId,
      commentId,
      content,
      time
    }, t)
    const article = await Article.findOne({
      where: {
        id: articleId
      }
    })
    // article.commentNum++
    const saveArt = await article.update({
      commentNum: article.commentNum+1
    }, {
      t
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'add Reply success'
    }
  }).catch(err => {
    ctx.status = 400
  })
})

/**
 * @router GET /comment/getReply
 * @description 获取某篇文章的所有回复
 * @params articleId 文章id
 * @access public
 */
router.get('/getReply', async ctx => {
  const articleId = ctx.query.articleId
  const res = await Reply.findAll({
    where: {
      articleId
    },
    include: {
      model: User,
      as: 'from'
    }
  })
  if (res) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'get Reply success',
      reply: res
    }
    return
  }
  ctx.status = 400
})


module.exports = router.routes()