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

// 引入文章 Model
const Article = require('../models/ArticleModel')
// 引入文章分组 Model
const ArticleGroup = require('../models/ArticleGroupModel')
// 引入用户 Model
const User = require('../models/UserModel')
// 引入like Model
const Like = require('../models/LikeModel')
// 引入sequelize
const sequelize = require('../mysql/sequelize')
// 引入sequelize操作符
const Op = require('sequelize').Op



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
    },
    order: [
      ['updatedAt', 'DESC']
    ]
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
      html: '<h1 style="text-align:center;">暂无内容</h1>',
      createdAt: time,
      updatedAt: time,
      labelImg: `https://${config.imgHost}/default_label_img.jpg`
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
 * @description 根据条件文章列表
 * @params userId || groupId
 * @access private
 */
router.get('/getArticleList', passport.authenticate('jwt', {session:false}), async ctx => {
  const articles = await Article.findAll({
    where: ctx.query,
    include: {
      model: User,
      as: 'userInfo'
    },
    // 根据更新时间降序查找，最新评论在上面
    order: [
      ['updated_at', 'DESC']
    ]
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
  const updateArt = await sequelize.transaction(async t => {
    // 文章id
    const id = ctx.request.body.id
    // 分组id
    const groupId = ctx.request.body.groupId
    // 查找文章
    const article = await Article.findOne({
      where: {
        id
      },
      t
    })
    const params = {}
    if (ctx.request.body.tags) {
      params.tags = ctx.request.body.tags
    }
    // 规范文章内容
    if (ctx.request.body.content) {
      // 文章内容
      const content = ctx.request.body.content
      console.log('content:', content)
      params.content = content
      // 获取文章的简介
      // 创建中文正则符
      let reg = /[\u4e00-\u9fa5]/g
      if (params.content.match(reg)) {
        params.summary = params.content.match(reg).join('').substring(0,60) + '...'
      }
      // const reg1 = new RegExp("<.+?>","g")
      // const reg2 = new RegExp("&.*;","g")
      // let summary = content.replace(reg1, '')
      // summary = summary.replace(reg2, '')
      // summary = summary.substring(0,100) + '...'
      // params.summary = summary
    }
    // 文章标题
    if (ctx.request.body.title) {
      // 标题
      params.title = ctx.request.body.title
    }
    // 标签图
    if (ctx.request.body.labelImg) {
      params.labelImg = ctx.request.body.labelImg
    }
    // 更新时间
    params.updatedAt = new Date().getTime()
    console.log(params)
    const res = await article.update(params, t)
    if (params.content) {
      // 更新这个分组的updatedAt
      const group = await ArticleGroup.findOne({
        where: {
          id: groupId
        },
        t
      })
      const updateGroup = await group.update({
        updatedAt: new Date().getTime()
      },t)
    }
    

    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'update article success'
    }
  }).catch(err => {
    ctx.status = 400
  })
})

/**
 * @router POST /article/deleteArticle
 * @description 删除文章
 * @params id 文章id
 * @access private
 */
router.post('/deleteArticle', async ctx => {
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

/**
 * @router GET /article/getAllArticle
 * @description 获取所有文章流
 * @access public
 */
router.get('/getAllArticle', async ctx => {
  const res = await Article.findAll({
    where: {
      isPublic: 1
    },
    include: {
      model: User,
      as: 'userInfo'
    },
    // 根据更新时间降序查找，最新编辑的文章放在最上面
    order: [
      ['updatedAt', 'DESC']
    ]
  })
  ctx.status = 200
  ctx.body = {
    success: true,
    article: res
  }
  return
  ctx.status = 400
})

/**
 * @router GET /article/getOneArticle
 * @description 根据文章id获取文章
 * @access public
 */
router.get('/getOneArticle', async ctx => {
  const id = ctx.query.id
  const res = await Article.findOne({
    where: {
      id
    },
    include: {
      model: User,
      as: 'userInfo'
    }
  })
  if (res) {
    ctx.status = 200
    ctx.body = {
      success: true,
      article: res,
      msg: 'get one article success'
    }
    return 
  }
  ctx.status = 400
})

/**
 * @router POST /article/likeArticle
 * @description 用户点击喜欢某一篇文章
 * @access private
 */
router.post('/likeArticle', passport.authenticate('jwt', {session:false}), async ctx => {
  const userId = ctx.request.body.userId
  const articleId = ctx.request.body.articleId
  const time = new Date().getTime()
  const res = await Like.create({
    userId,
    articleId,
    time
  })
  if (res) {
    const article = await Article.findOne({
      where: {
        id: articleId
      }
    })
    article.likeNum++
    const update = await article.save()
    if (update) {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: 'like success'
      }
      return
    }
  }
  ctx.status = 400
})

/**
 * @router GET /article/articleLikeList
 * @description 获取给文章点过赞的用户
 * @access public
 */
router.get('/articleLikeList', async ctx => {
  const articleId = ctx.query.articleId
  console.log(articleId)
  const res = await Like.findAll({
    where: {
      articleId
    }
  })
  if (res) {
    const likeList = []
    res.forEach(item => {
      likeList.push(item.userId)
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      likeList,
      msg: 'get likeList success'
    }
    return
  }
  ctx.status = 400
})

/**
 * @router POST /article/dislikeArticle
 * @description 用户取消喜欢一篇文章
 * @access private
 */
router.post('/dislikeArticle', passport.authenticate('jwt', {session:false}), async ctx => {
  const { userId, articleId } = ctx.request.body
  const res = Like.destroy({
    where: {
      userId,
      articleId
    }
  })
  if (res) {
    const article = await Article.findOne({
      where: {
        id: articleId
      }
    })
    article.likeNum--
    const update = await article.save()
    if (update) {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: 'dislike article success'
      }
      return
    }
  }
  ctx.status = 400
})

/**
 * @router GET /article/viewArticle
 * @description 增加文章的查看次数
 * @access public
 */
router.get('/viewArticle', async ctx => {
  const res = await sequelize.transaction(async t => {
    const id = ctx.query.id
    const article = await Article.findOne({
      where: {
        id
      },
      t
    })
    const saveArt = await article.update({
      viewTime: article.viewTime+1
    }, {
      t
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'view article success'
    }
  }).catch(err => {
    ctx.status = 400
  })
})

/**
 * @router GET /article/publishArticle
 * @description 将文章状态修改为发布
 * @access private
 */
router.get('/publishArticle', passport.authenticate('jwt', {session:false}), async ctx => {
  const id = ctx.query.id
  const article = await Article.findOne({
    where: {
      id
    }
  })
  const updateArt = await article.update({
    isPublic: 1
  })
  if (updateArt) {
    ctx.status = 200
    ctx.body = {
      success: true
    }
  } else {
    ctx.status = 400
  }
})

/**
 * @router GET /article/unPublishArticle
 * @description 将文章状态修改为未发布
 * @access private
 */
router.get('/unPublishArticle', passport.authenticate('jwt', {session:false}), async ctx => {
  const id = ctx.query.id
  const article = await Article.findOne({
    where: {
      id
    }
  })
  const updateArt = await article.update({
    isPublic: 0
  })
  if (updateArt) {
    ctx.status = 200
    ctx.body = {
      success: true
    }
  } else {
    ctx.status = 400
  }
})

/**
 * @router GET /article/getRecommend
 * @description 获取该标签的其他文章推荐
 * @access public
 */
router.get('/getRecommend', async ctx => {
  // 获取标签名和这个文章名
  const {tag, id} = ctx.query
  let arts = await Article.findAll({
    where: {
      id: {
        [Op.ne]: id
      },
      tags: {
        [Op.like]: '%' + tag + '%'
      },
      isPublic: 1
    },
    attributes: [
      'id',
      'title',
      'updated_at',
      'like_num',
      'view_time',
      'tags',
      'comment_num'
    ],
    include: {
      model: User,
      as: 'userInfo'
    }
  })
  if (arts.length > 0) {
    // 将用户正在读的文章删除
    ctx.status = 200
    ctx.body = {
      success: true,
      arts
    }
  } else {
    ctx.status = 200
    ctx.body = {
      success: false,
      msg: 'no available articles...'
    }
  }

})



module.exports = router.routes()