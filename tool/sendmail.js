const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '1131911308@qq.com',
    pass: 'vwasigitiogjhhdd'  // 授权码，qq邮箱-设置-账户
  }
})

module.exports = transporter