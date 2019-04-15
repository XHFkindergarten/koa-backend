const Koa = require('koa')
const app = new Koa()

const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const passport = require('koa-passport')

const Router = require('koa-router')
const router = new Router()





// 引入index路由
const index = require('./routes/index')
router.use(index)
// 引入users路由
const users = require('./routes/users')
router.use('/users',users)

// middlewares
app.use(koaBody())

// 将所有routes挂载在app上
app.use(router.routes()).use(router.allowedMethods());

// passport初始化
app.use(passport.initialize())
app.use(passport.session())
// 调用passport时自动调用config/passport的jwt策略
require('./config/passport')(passport)



// error handler 
onerror(app)



// 美化和简化返回json格式response
app.use(json())
app.use(logger())

// 静态文件中间件，public文件夹中的内容可以被外部访问
app.use(require('koa-static')(__dirname + '/public'))

// views文件中后缀名为pug的文件将被渲染
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
// 输出：请求方法 请求路由名 — 执行时间
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
