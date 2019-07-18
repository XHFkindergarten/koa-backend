// 监听端口
const port = 3000

const secureOrKey = 'secureOrKey'

const database = require('./db')

const devHost = 'localhost:3000'

const prdHost = '34.92.157.70:3000'

const host = process.env.NODE_ENV=='development'?devHost:prdHost

const devSslUrl='/Users/mac/repository/ssl'

const prdSslUrl='/usr/local/nginx/sbin/nginx/ssl'

const sslUrl = process.env.NODE_ENV=='development'?devSslUrl:prdSslUrl

// 七牛云服务器
const imgHost = 'img.xhfkindergarten.cn'

// 七牛云的公钥和私钥
const accessKey = 'WFCJDsqbMl_VxaFpz4cyh2DUrH5bk_2C9YpICq_-'
const secretKey = 'sNBjhBK3N1qt7_1V_qxnQ4G24St1dkhCdGjVFzGJ'
// 存储空间名称
const bucket = 'testsavezone'
// 七牛云上传url
const uploadUrl = 'https://up-z2.qiniup.com'

// 一次取出的动态数量
const dailySize = 5

// 标签的组合字符
const tagGap = 'gapline'

// 进行邮箱验证时的相关配置信息
const emailInfo = (code) => {
  const info = {
    from: '1131911308@qq.com',  // 发送人
    subject: 'XHFkindergarten.com邮箱验证码',  // 邮件标题
    html: `
    <div style="display: flex;
      flex-direction: cloumn;
      justify-content: center;
      align-items: center;">
      <img style="width:300px" src="https://img.xhfkindergarten.cn/default-bird.png" />
    </div>
    
    <div style="display: flex;
      flex-direction: cloumn;
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
  devHost,
  prdHost,
  host,
  imgHost,
  accessKey,
  secretKey,
  bucket,
  uploadUrl,
  dailySize,
  tagGap,
  sslUrl
}