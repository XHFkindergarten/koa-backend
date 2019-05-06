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

/**
 * @router POST /article/addGroup
 * @description 为某个用户添加文章分组
 * @params userId 用户的id name 分组名
 * @access private
 */
router.post('/addGroup', passport.authenticate('jwt', {session:false}), async ctx => {
    // 获取当前的时间戳（毫秒数格式）
    const time = new Date().getTime()
    console.log(time)
    const mysql = new Mysql()
    const addGroup = await mysql.query(SQL.insert({
      tableName: 'articleGroup',
      params: {
        userId: ctx.request.body.userId,
        name: ctx.request.body.name,
        createdAt: time,
        updatedAt: time
      }
    }))
    if (addGroup.affectedRows==1) {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: 'contratuations, u successfully add a group!',
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
  const id = ctx.query.userId
  const mysql = new Mysql()
  const queryGroup = await mysql.query(SQL.query({
    tableName: 'articleGroup',
    params: {
      userId: id
    }
  }))
  if (queryGroup.length>0) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'congratuations,query article group success!',
      group: queryGroup
    }
    return
  } else {
    ctx.status = 200
    ctx.body = {
      success: false,
      msg: '没有创建任何文章分组'
    }
  }
})

/**
 * @router POST /article/editGroupName
 * @description 修改某个用户的某个文章分组的名称
 * @params id 分组id
 * @params name 新的分组名称
 * @access private
 */
router.post('/editGroupName',passport.authenticate('jwt', {session:false}),async ctx => {
  const mysql = new Mysql()
  const res = await mysql.query(SQL.update({
    tableName: 'articleGroup',
    where: {
      id: ctx.request.body.id
    },
    params: {
      name: ctx.request.body.name
    }
  }))
  if (res.affectedRows==1) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'congratuations, update group info success!'
    }
    return
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
  console.log(ctx.request.body.id)
  const mysql = new Mysql()
  const res = await mysql.query(SQL.delete({
    tableName: 'articleGroup',
    where: {
      id: ctx.request.body.id
    }
  }))
  if (res.affectedRows==1) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'congratuations, delete Article group success'
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
  console.log(ctx.request.body)
  const { userId, groupId, content } = ctx.request.body
  const time = new Date().getTime()
  const mysql = new Mysql()
  
  // 获取该分组中已有的文章条数
  const groupLength = await mysql.query(SQL.count({
    tableName: 'article',
    params: {
      groupId
    }
  }))
  const length = groupLength[0]['COUNT(*)']

  const res = await mysql.query(SQL.insert({
    tableName: 'article',
    params: {
      title: `未命名(${length})`,
      userId,
      groupId,
      content,
      createdAt: time,
      updatedAt: time
    }
  }))
  if (res.affectedRows==1) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'congratulations, create article success!',
    }
    return
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
  console.log(groupId)
  const mysql = new Mysql()
  const res = await mysql.query(SQL.query({
    tableName: 'article',
    params: {
      groupId
    }
  }))
  if (res) {
    ctx.status = 200
    ctx.body = {
      success: true,
      article: res
    }
    return
  }
  ctx.status = 400
})





module.exports = router.routes()