const isEmpty = require('../validation/is-empty')
const Validator = require('validator')

// 登录表单验证
const validateLoginInput = data => {
  // 错误处理obj
  let errors = {}
  
  if (isEmpty(data.email)) {
    errors.email = '登录邮箱不得为空'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = '邮箱格式非法'
  }

  if (isEmpty(data.password)) {
    errors.password = '密码不得为空'
  }
  return {
    errors,
    isValid:isEmpty(errors)
  }
}

module.exports = validateLoginInput