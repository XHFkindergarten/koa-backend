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
// 引用工具方法
const Utils = require('../tool/utils')
// 引入加密和解密工具
const bcrypt = require('bcrypt')
// 引入json web token 生成工具
const jwt = require('jsonwebtoken')
// 引入鉴权工具 koa-passport
const passport = require('koa-passport')
// 引入邮件发送实例
const transporter = require('../tool/sendmail')
// 引入nodejs的文件处理插件
const fs = require('fs')
// 引入path组件
const path = require('path')
// 引入图形处理插件gm
const gm = require('gm').subClass({imageMagick: true})

// 引入sequelize
const sequelize = require('../mysql/sequelize')
// 引入用户 Model
const User = require('../models/UserModel')
// 引入权限 Model
const Role = require('../models/RoleModel')
// 引入文章分组 Model
const ArticleGroup = require('../models/ArticleGroupModel')

/**
 * @router GET /users defaultAPI
 * @description nothinig
 * @access public 接口是公开的
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
 * @access public 接口是公开的
 */
router.post('/register', async ctx => {
  // 对输入注册信息进行表单校验
  const {errors,isValid} = await ValidateRegister(ctx.request.body)
  if(!isValid) {
    ctx.status = 200
    ctx.body = {
      success: false,
      errors
    }
    return 
  }
  const findEmail = await User.findAll({
    where: {
      email: ctx.request.body.email
    }
  })
  // 查询邮箱是否已经被占用
  // 生成查询sql语句
  if (findEmail.length>0) {
    ctx.status = 200
    ctx.body = {
      success: false,
      msg: '该邮箱已注册'
    }
    return 
  }
  const {name, email, password} = ctx.request.body
  const avatar = `http://${config.host}/upload/avatar/default-avatar.png`
  // 将用户数据插入users表
  const res = await User.create({
    name,
    email,
    avatar,
    password: Utils.enbcrypt(password)
  })
  if (res) {
    const userId = res.null
    const createRole = await Role.create({
      userId,
      role: 0
    })
    if (createRole) {
      // 如果成功，为用户创建一个默认文章分组
      const time = new Date().getTime()
      const createGroup = await ArticleGroup.create({
        userId,
        createdAt: time,
        updatedAt: time
      })
      if (createGroup) {
        ctx.status = 200
        ctx.body = {
          success: true,
          data: {
            username: name,
            avatar,
            email
          }
        }
        return
      }
    }
    
  }
  ctx.status = 400
})

/**
 * @router POST /users/uploadImg
 * @param file上传的图片
 * @param type 值为avatar代表上传到头像文件夹,为context说明上传到富文本文件夹,为label上传标签图文件夹
 * @description 上传用户头像
 * @access public 接口是公开的
 */
router.post('/uploadImg', async ctx => {
  // 获取上传文件
  const file = ctx.request.files.file
  // 如果文件不是图片，返回错误
  if (file.type!='image/jpeg' && file.type!='image/jpg' && file.type!='image/png') {
    ctx.status = 200
    ctx.body = {
      success: false,
      msg: '只允许上传图片'
    }
    return
  }
  // 创建可读流
  const reader = fs.createReadStream(file.path)
  const uniqueKey = Utils.timeValue()
  // 创建写入路径
  let filePath = path.join(__dirname,'..', `public/upload/${ctx.request.body.type}/`) + `${uniqueKey}.${Utils.getFileType(file.type)}`
  console.log(filePath)
  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 可读流通过管道写入可写流
  reader.pipe(upStream)

  // 增加缩略图
  if (ctx.request.type=='label') {
    gm(filePath)
    .identify(function(err, data) {
      if(!err) {
        gm(filePath)
          .quality(10)
          .noProfile()
          .write(filePath, function(err){
            if(!err){
              ctx.status = 200
              ctx.body = {
                msg: 'success'
              }
            }
          })
      }
    })
  }
  ctx.status = 200
  ctx.body = {
    success: true,
    msg: 'congratuations,upload avatarImg success!',
    imgpath: `http://${config.host}/upload/${ctx.request.body.type}/${uniqueKey}.${Utils.getFileType(file.type)}`
  }
  
})

/**
 * @router GET /users/sendemail
 * @description 向注册邮箱发送验证邮件
 * @access public 接口是公开的
 */
router.get('/sendmail', async ctx => {
  const code = Utils.randCode(6)
  const mailOptions = {
    ...config.emailInfo(code),
    to: ctx.query.email
  }
  // 首先判断该邮箱是否注册过
  const SQLdata = {
    // 表名
    tableName: 'users',
    // 参数
    params: {
      email: ctx.query.email
    }
  }
  const sql = SQL.query(SQLdata)
  const mysql = new Mysql()
  const res = await mysql.query(sql)
  if (res.length>0) {
    ctx.status = 200
    ctx.body = {
      success: false,
      msg: '该邮箱已经注册'
    }
    return
  }

  console.log(mailOptions)
  await transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      ctx.status = 200
      ctx.body = {
        success: false,
        msg: '发送失败'
      }
      return
    }
  })
  ctx.status = 200
  ctx.body = {
    code,
    success: true,
    msg: 'congratuations, send email success!'
  }
})

/**
 * @router POST /users/login
 * @description 登录接口API
 * @param email password
 * @return token
 * @access public 接口是公开的 
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
    ctx.status = 200
    ctx.body = {
      success: false,
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
      expiresIn: 24*60*60 // token有效时间
    })
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'congratuations, login success',
      token: 'Bearer ' + token
    }
  } else {
    console.log('pasword wrong')
    ctx.status = 200
    ctx.body = {
      success: false,
      msg: 'password wrong'
    }
  }
})

/**
 * @router GET /users/current
 * @description 获取用户信息API
 * @access private 接口是私密的! 
 */
// 使用【jwt策略】进行鉴权,鉴权方法可自行定义，此处在~/config/passport中定义了（不开启session）
router.get('/current', passport.authenticate('jwt', {session:false}),
  async ctx => {
    ctx.status = 200
    ctx.body = {
      id: ctx.state.user.id,
      email: ctx.state.user.email,
      username: ctx.state.user.name,
      avatar: ctx.state.user.avatar,
      mood: ctx.state.user.mood,
      sign: ctx.state.user.sign
    }
})


/**
 * @router GET /users/role
 * @description 根据用户id获取用户权限
 * @access public 接口是公开的
 */
router.get('/role', async ctx => {
  if(ctx.request.query.id) {
    const mysql = new Mysql()
    const res = await mysql.query(SQL.query({
      tableName: 'role',
      params: {
        userId: ctx.request.query.id
      }
    }))
    if (res.length>0) {
      let role = []
      res.forEach(r => {
        role.push(r.roleId)
      })
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: 'congratuations,get roleInfo success!',
        data: role
      }
      return
    } else {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg: 'this user got no role'
      }
      return
    }
  }
  ctx.status = 400
})

/**
 * @router POST /users/update
 * @description 更新用户信息
 * @access private 接口是私密的
 */
router.post('/update', passport.authenticate('jwt', {session:false}), async ctx => {
  const id = ctx.request.body.id
  const params = ctx.request.body
  delete params.id
  const user = await User.findOne({
    where: {
      id
    }
  })
  const keys = Object.keys(params)
  keys.forEach(key => {
    user[key] = params[key]
  })
  const res = await user.save()
  if (res) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'update userinfo success'
    }
    return
  }
  ctx.status = 400
})

/**
 * @router GET /users/getOneUser
 * @description 根据用户id获取基本信息
 * @access public
 */
router.get('/getOneUser', async ctx => {
  const id = ctx.query.id
  const user = await User.findOne({
    where: {
      id
    }
  })
  if (user) {
    ctx.status = 200
    ctx.body = {
      success: true,
      msg: 'get userinfo',
      user: {
        avatar: user.avatar,
        email: user.email,
        id: user.id,
        name: user.name,
        mood: user.mood,
        sign: user.sign
      }
    }
    return
  }
  ctx.status = 400
})


module.exports = router.routes()
