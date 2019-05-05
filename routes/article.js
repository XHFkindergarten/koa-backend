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
router.post('/addGroup',
  passport.authenticate('jwt', {session:false}),
  async ctx => {
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

router.get('/getGroup',
  passport.authenticate('jwt', {session:false}),
  async ctx => {
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

module.exports = router.routes()