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
// 引入邮件发送实例
const transporter = require('../tool/sendmail')
// 引入nodejs的文件处理插件
const fs = require('fs')
// 引入path组件
const path = require('path')
// 引入图形处理插件gm
const gm = require('gm').subClass({imageMagick: true})

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
    ctx.status = 200
    ctx.body = {
      success: false,
      errors
    }
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
    ctx.status = 200
    ctx.body = {
      success: false,
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
      success: true,
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
 * @router POST /users/avatar
 * @description 上传用户头像
 * @access 接口是公开的
 */
router.post('/avatar', async ctx => {
  // 获取上传文件
  const file = ctx.request.files.file
  console.log(file)
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
  // 创建写入路径
  let filePath = path.join(__dirname,'..', 'public/upload/avatar/') + `avatar${ctx.request.body.id}.${Utils.getFileType(file.name)}`
  console.log(filePath)
  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 可读流通过管道写入可写流
  reader.pipe(upStream)
  ctx.status = 200
  ctx.body = {
    success: true,
    msg: 'congratuations,upload avatarImg success!',
    imgpath: `http://${config.host}/upload/avatar/avatar${ctx.request.body.id}.${Utils.getFileType(file.name)}`
  }
  // 统一图片的长宽，挤成一个正方形
  // let width,height
  // gm(filePath)
  //   .identify(function(err, data) {
  //     if(!err) {
  //       const {width, height} = data.size
  //       const side = Math.min(width, height)
  //       gm(filePath)
  //         .resize(side, side,'!')
  //         .noProfile()
  //         .write(filePath, function(err){
  //           if(!err){
  //             ctx.status = 200
  //             ctx.body = {
  //               msg: 'success'
  //             }
  //           }
  //         })
  //     }
  //   })
  
})

/**
 * @router GET /users/sendemail
 * @description 向注册邮箱发送验证邮件
 * @access 接口是公开的
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

/**
 * @router GET /users/role
 * @description 根据用户id获取用户权限
 * @access 接口是公开的
 */
router.get('/role', async ctx => {
  if(ctx.request.query.id) {
    const mysql = new Mysql()
    const queryRole = await mysql.query(SQL.query({
      tableName: 'role',
      params: {
        userId: ctx.request.query.id
      }
    }))
      .then(res => {
        if (res.length>0) {
          let roles = []
          res.forEach(r => {
            roles.push(r.roleId)
          });
          ctx.status = 200
          ctx.body = {
            success: true,
            msg: 'congratuations,get roleInfo success!',
            data: roles
          }
        }else {
          ctx.status = 200
          ctx.body = {
            success: true,
            msg: 'this user got no role'
          }
        }
      })
  } else {
    ctx.status = 400
  }
})


module.exports = router.routes()
