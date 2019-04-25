const path = require('path')
const serve = require('koa-static')

const main = serve(path.join(__dirname))
