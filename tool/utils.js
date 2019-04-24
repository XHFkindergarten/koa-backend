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

const utils = {
  enbcrypt,
  randCode
}

module.exports = utils