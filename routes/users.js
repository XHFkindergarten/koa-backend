// 新建路由实例
const Router = require('koa-router');
const router = new Router()
// 引入配置
const config = require('../config/default')
// 引入数据库
const Mysql = require('../mysql/index')
// 引入注册信息表单验证方法
const ValidateRegister = require('../validation/register')
// 引入登录信息表单验证方法
const ValidateLogin = require('../validation/login')
// 引入sql语句生成方法
const SQL = require('../mysql/sql')
// 引入全球通用头像
const gravatar = require('gravatar')
// 引用工具方法
const Utils = require('../tool/utils')
// 引入加密和解密工具
const bcrypt = require('bcrypt')
// 引入json web token 生成工具
const jwt = require('jsonwebtoken')
// 引入鉴权工具 koa-passport
const passport = require('koa-passport')

/**
 * @router GET /users defaultAPI
 * @description nothinig
 * @access 接口是公开的
 */
router.get('/', (ctx, next) => {
  ctx.status = 200
  ctx.body = {
    msg:'user API is working...'
  }
})

/**
 * @router POST /users/register
 * @description 注册接口API
 * @params name email password password2
 * @access 接口是公开的
 */
router.post('/register', async ctx => {
  // 对输入注册信息进行表单校验
  const {errors,isValid} = await ValidateRegister(ctx.request.body)
  if(!isValid) {
    ctx.status = 400
    ctx.body = errors
    return 
  }

  const mysql = new Mysql()

  // 查询邮箱是否已经被占用
  // 生成查询sql语句
  const sqlEmail = SQL.query({
    tableName: 'users',
    params: {
      email: ctx.request.body.email
    }
  })
  const emailRes = await mysql.query(sqlEmail)
  if(emailRes.length!=0){
    ctx.status = 400
    ctx.body = {
      msg: '该邮箱已注册'
    }
    return 
  }

  // sql数据
  const SQLdata = {
    // 表名
    tableName: 'users',
    // 参数
    params: {
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      avatar: gravatar.url(ctx.request.body.email,{
        s: '200', r: 'pg', d: 'mm'
      }),
      password: Utils.enbcrypt(ctx.request.body.password)
    }
  }
  // 生成sql语句
  const sql = SQL.insert(SQLdata)
  const res = await mysql.query(sql)
  if (res.affectedRows==1) {
    ctx.status = 200
    ctx.body = {
      data: {
        username: SQLdata.params.name,
        avatar: SQLdata.params.avatar,
        email: SQLdata.params.email,
      },
      msg: 'congratuations,register success!'
    }
  }
})

/**
 * @router POST /users/login
 * @description 登录接口API
 * @param email password
 * @return token
 * @access 接口是公开的 
 */
router.post('/login', async ctx => {
  // 进行表单校验
  const {errors, isValid} = ValidateLogin(ctx.request.body)
  if(!isValid) {
    ctx.status = 400
    ctx.body = errors
    return 
  }
  // 使用sql查询邮箱是否存在
  const mysql = new Mysql()
  const queryEmail = await mysql.query(SQL.query({
    tableName: 'users',
    params: {
      email: ctx.request.body.email
    }
  }))
  if (queryEmail.length==0) {
    ctx.status = 400
    ctx.body = {
      msg: '该邮箱尚未注册'
    }
    return
  }
  // 如果邮箱存在,校验密码是否正确
  const user = queryEmail[0] // 查询到的数据库中的用户信息
  const compare = await bcrypt.compareSync(ctx.request.body.password, user.password)
  if(compare) {
    const payLoad = {
      name: user.name,
      id: user.id,
      avatar: user.avatar
    }
    // 生成token字符串
    const token = jwt.sign(payLoad,config.secureOrKey,{
      expiresIn: 60*60 // token有效时间
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'congratuations, login success',
      token: 'Bearer ' + token
    }
  } else {
    ctx.status = 400
    ctx.body = {
      success: false,
      msg: 'password wrong'
    }
  }
})

/**
 * @router GET /users/current
 * @description 获取用户信息API
 * @access 接口是私密的! 
 */
// 使用【jwt策略】进行鉴权,鉴权方法可自行定义，此处在~/config/passport中定义了（不开启session）
router.get('/current', passport.authenticate('jwt', {session:false}),
  async ctx => {
    ctx.body = {
      id: ctx.state.user.id,
      email: ctx.state.user.email,
      username: ctx.state.user.name,
      avatar: ctx.state.user.avatar
    }
})


module.exports = router.routes()
