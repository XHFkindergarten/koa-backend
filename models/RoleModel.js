const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')

const RoleModel = sequelize.define('role', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  userId: Sequelize.INTEGER,
  roleId: Sequelize.INTEGER
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})

module.exports = RoleModel