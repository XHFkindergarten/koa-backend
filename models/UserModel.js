const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')

const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: Sequelize.STRING(255),
  email: Sequelize.STRING(255),
  avatar: Sequelize.STRING(255),
  password: Sequelize.STRING(255),
  mood: Sequelize.STRING(255),
  sign: Sequelize.STRING(255),
  dailyNotice: {
    type: Sequelize.INTEGER,
    field: 'daily_notice'
  }
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})

module.exports = User