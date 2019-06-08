const router = require('koa-router')()
// 引入文档阅读工具mammoth
const mammoth = require('mammoth')
const fs = require('fs')
const AipSpeechClient = require('baidu-aip-sdk').speech
// 引入pdf文本获取工具
const pdf2text = require('pdf2text')
// 引入axios
const axios = require('axios')
// 引入config
const config = require('../config/default')

// 七牛云的公钥和私钥
const accessKey = config.accessKey
const secretKey = config.secretKey
// 存储空间名称
const bucket = config.bucket

// 引入七牛云插件
const qiniu = require('qiniu')
// 引入七牛云上传模块
const qn = require('qn')

const FormData = require('form-data')

const APP_ID = '16418003'
const API_KEY = 'no1YDyOqiniqZo1ubQGbXT8O'
const SECRET_KEY = '2FivinIR5Pp0FBfZTBSGFs0RzDPH4KOS'

const client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY)



/**
 * @router /extra/getWord
 * @params file
 * @access private
 */
router.post('/getWord', async ctx => {
  console.log(ctx.request.body)
  let {spd, per, vol} = ctx.request.body
  spd = parseInt(spd)
  per = parseInt(per)
  vol = parseInt(vol)
  // 获取七牛token
  let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  let options = {
    scope: bucket,
    expires: 3600 * 24
  };
  let putPolicy =  new qiniu.rs.PutPolicy(options);
  let uploadToken= putPolicy.uploadToken(mac);
  console.log(uploadToken)

  // 获取file
  const {file} = ctx.request.files
  console.log(file)
  let context1 = ''
  if (file.type === 'application/pdf') {
    console.log('PDF文件')
    console.log(file.path)

    await pdf2text(file.path).then(pages => {
      pages.forEach(page => {
        context1 += page.join(' ')
      })
    })
  } else {
    const result = await mammoth.extractRawText({path: file.path})
    console.log('文本长度', result.value.length)
    context1 = result.value
  }
  const speechConfig = {
    spd: spd || 5, // 速度0-10
    per: per || 4, // 0女声, 1男声, 3情感合成男, 4情感合成女
    vol: vol || 5, // 音量 0-15
  }
  
  const audioArr = []
  const limit = 500
  const size = Math.ceil(context1.length / limit)
  let context
  for (let i=0; i<size; i++) {
    context = context1.substring(i*limit, i*limit + limit)
    console.log(context.length)
    console.log(context)
    await client.text2audio(context, speechConfig).then( function(res) {
      if (res.data) {
        const key = new Date().getTime()
        const path = `./public/audio/${key}.mp3`
        fs.writeFileSync(path, res.data)
        audioArr.push(`http://localhost:3000/audio/${key}.mp3`)
      } else {
        console.log('服务器错误')
      }
    }, function (e) {
      console.log('网络发生错误')
    })
  }
  ctx.status = 200
  ctx.body = {
    success: true,
    audio: audioArr
  }
})

module.exports = router.routes()
