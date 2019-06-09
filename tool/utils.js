const bcrypt = require('bcrypt')

// 密码加密
const enbcrypt = password => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

/**
 * 生成一个length长度的验证码
 * @param  length 验证码长度
 */
const randCode = (length) => {
  const codeArr = [0,1,2,3,4,5,6,7,8,9,
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N',
    'O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let code = ""
  for (let i=0;i<length;i++) {
    let random = Math.floor(Math.random() * 36)
    code += codeArr[random]
  }
  return code
}

/**
 * 获取文件的后缀
 * @param filename
 */
const getFileType = typeName => {
  const type = typeName.split('/')[1]
  return type
}

/**
 * 根据时间生成一个独一无二的数字串
 * 可以作为文件名
 */
const timeValue = () => {
  const date = new Date()
  return date.valueOf()
}

/**
 * 根据int类型的时间返回 y-m-d h-m-s 格式的字符串
 */
const formatTime = (time) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes()}`
}

const utils = {
  enbcrypt,
  randCode,
  getFileType,
  timeValue,
  formatTime
}

module.exports = utils