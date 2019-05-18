// 监听端口
const port = 3000

const secureOrKey = 'secureOrKey'

const database = require('./db')

const devHost = 'localhost:3000'

const prdHost = '35.241.100.176:3000'

const host = process.env.NODE_ENV=='development'?devHost:prdHost

// 七牛云图片服务器
const imgHost = 'img.xhfkindergarten.cn'

const code = '123'
// 进行邮箱验证时的相关配置信息
const emailInfo = (code) => {
  const info = {
    from: '1131911308@qq.com',  // 发送人
    subject: 'XHFkindergarten.com邮箱验证码',  // 邮件标题
    html: `
    <div style="display: flex;
      justify-content: center;
      align-items: center;">
      <h2>感谢注册XHFkindergarten的网站</h2>
    </div>
    <div style="display: flex;
      justify-content: center;
      align-items: center;">
      <h2>您收到的验证码为:</h2>
    </div>
    <div style="display: flex;
      justify-content: center;
      align-items: center;">
      <h1>${code}</h1>
    </div>` // 发送内容
  }
  return info
}

module.exports = {
  port,
  database,
  secureOrKey,
  emailInfo,
  host,
  imgHost
}