const isEmpty = require('../validation/is-empty')
const Validator = require('validator')

// 注册表单验证
const validateRegisterInput = data => {
  // 表单校验错误obj
  let errors = {}

  // ======================用户输入表单校验=======================
  // 用户名校验
  if (isEmpty(data.name)) {
    errors.name = '用户名不能为空'
  }else if (!Validator.isLength(data.name,{min:2,max:18})){
    errors.name = '用户名长度只能为2-18位'
  }

  // 注册邮箱校验
  if (isEmpty(data.email)) {
    errors.email = '用户邮箱不能为空'
  } else if (!Validator.isEmail(data.email)) {
    errors.email = '邮箱格式不合法'
  }

  // 验证输入密码
  if (isEmpty(data.password)) {
    errors.password = '用户密码不能为空'
  }else if (!Validator.isLength(data.password,{min:6,max:18})) {
    errors.password = '用户密码长度只能为6-18位'
  }

  // 验证重复输入密码
  if (isEmpty(data.password2)) {
    errors.password2 = '重复输入密码不能为空'
  } else if (!Validator.isLength(data.password2,{min:6,max:18})) {
    errors.password2 = '重复输入密码长度只能为6-18位'
  } else if (!Validator.equals(data.password,data.password2)) {
    errors.password2 = '两次输入密码不一致!'
  }

  return {
    errors,
    isValid:isEmpty(errors)
  }

}

module.exports = validateRegisterInput