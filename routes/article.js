// 新建路由实例
const Router = require('koa-router')
const router = new Router()
// 引入配置
const config = require('../config/default')
// 引入数据库
const Mysql = require('../mysql/index')
// 引入sql语句生成方法
const SQL = require('../mysql/sql')
// 引用工具方法
const Utils = require('../tool/utils')
// 引入鉴权工具 koa-passport
const passport = require('koa-passport')

// 引入文章Model
const Article = require('../models/ArticleModel')
// 引入文章分组Model
const ArticleGroup = require('../models/ArticleGroupModel')

/**
 * @router POST /article/addGroup
 * @description 为某个用户添加文章分组
 * @params userId 用户的id name 分组名
 * @access private
 */
router.post('/addGroup', passport.authenticate('jwt', {session:false}), async ctx => {
    // 获取当前的时间戳（毫秒数格式）
    const time = new Date().getTime()
    const res = await ArticleGroup.create({
      userId: ctx.request.body.userId,
      name: ctx.request.body.name,
      createdAt: time,
      updatedAt: time
    })
    if (res) {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: 'save Group success'
      }
      return
    }
    ctx.status = 400
})

/**
 * @router POST /article/getGroup
 * @description 获取某个用户的文章分组
 * @params userId 用户id
 * @access private
 */

router.get('/getGroup',passport.authenticate('jwt', {session:false}),async ctx => {
  const userId = ctx.query.userId
  const groups = await ArticleGroup.findAll({
    where: {
      userId
    }
  })
  if (groups) {
    ctx.status = 200
    ctx.body = {
      success: true
    }
    if (groups.length>0) {
      ctx.body.group = groups
      ctx.body.msg = 'get groups success'
    } else {
      ctx.body.msg = 'no group'
    }
    return
  }
  ctx.status = 400
})

/**
 * @router POST /article/editGroupName
 * @description 修改某个用户的某个文章分组的名称
 * @params id 分组id
 * @params name 新的分组名称
 * @access private
 */
router.post('/editGroupName',passport.authenticate('jwt', {session:false}),async ctx => {
  const group = await ArticleGroup.findOne({
    where: {
      id: ctx.request.body.id
    }
  })
  if (group) {
    group.name = ctx.request.body.name
    const res = await group.save()
    if (res) {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: 'update group info success!'
      }
      return
    }
  }
  ctx.status = 400
})

/**
 * @router POST /article/deleteGroup
 * @description 删除某个用户的某个文章分组
 * @params id 分组id
 * @access private
 */
router.post('/deleteGroup',passport.authenticate('jwt', {session:false}),async ctx => {
  const res = await ArticleGroup.destroy({
    where: {
      id: ctx.request.body.id
    }
  })
  if (res) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'delete Article group success'
    }
    return
  }
  ctx.status = 400
})

/**
 * @router POST /article/addArticle
 * @description 新增文章
 * @params userId 用户id
 * @params groupId 分组id
 * @params content 文章text
 * @params title  文章标题(可不填)
 * @params summary  文章大意(可不填)
 * @params label_img  文章标签图(可不填)
 * @params createdAt  创建时间
 * @params updatedAt  更新时间
 * @access private
 */
router.post('/addArticle', passport.authenticate('jwt', {session:false}), async ctx => {
  const { userId, groupId, content } = ctx.request.body
  const time = new Date().getTime()
  let articleNum
  const articles = await Article.findAll({
    where: {
      groupId
    }
  })
  if (articles) {
    articleNum = articles.length
    const res = await Article.create({
      title: `未命名(${articleNum})`,
      userId,
      groupId,
      content,
      createdAt: time,
      updatedAt: time
    })
    if (res) {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: 'create Article success!'
      }
      return
    }
  }
  ctx.status = 400
})

/**
 * @router POST /article/getArticleList
 * @description 获取某个用户某个分组的文章列表
 * @params groupId
 * @access private
 */
router.get('/getArticleList', passport.authenticate('jwt', {session:false}), async ctx => {
  const groupId = ctx.query.groupId

  const articles = await Article.findAll({
    where: {
      groupId
    }
  })
  if (articles) {
    ctx.status = 200
    ctx.body = {
      success: true,
      article: articles
    }
    return
  }
  ctx.status = 400
})

/**
 * @router POST /article/updateArticle
 * @description 修改文章
 * @params id 文章id
 * @params content 文章内容
 * @params title 文章标题
 * @params summary 文章大意(自动生成)
 * @params label_img 标签图
 * @params updatedAt 更新时间(自动生成)
 * @access private
 */
router.post('/updateArticle', passport.authenticate('jwt', {session:false}), async ctx => {
  // 文章id
  const id = ctx.request.body.id
  // 文章内容
  const content = ctx.request.body.content
  // 更新内容
  const updatedAt = new Date().getTime()
  // 标题
  const title = ctx.request.body.title
  
  const article = await Article.findOne({
    where: {
      id
    }
  })
  article.updatedAt = updatedAt
  article.content = content
  article.title = title
  const res = await article.save()
  if (res) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'update article success'
    }
    return
  }
  ctx.status = 400
})

/**
 * @router POST /article/deleteArticle
 * @description 删除文章
 * @params id 文章id
 * @access private
 */
router.post('/deleteArticle', passport.authenticate('jwt', {session:false}), async ctx => {
  const res = await Article.destroy({
    where: {
      id: ctx.request.body.id
    }
  })
  if (res) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'congratulations, delete article success!'
    }
    return 
  }
  ctx.status = 400
})



module.exports = router.routes()