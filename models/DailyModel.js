const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')
const User = require('./UserModel')

const Daily = sequelize.define('daily', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  content: Sequelize.TEXT,
  pics: Sequelize.TEXT,
  createdAt: {
    field: 'created_at',
    type: Sequelize.BIGINT
  },
  userId: {
    field: 'user_id',
    type: Sequelize.INTEGER
  }
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})

// 构建和User表的关联关系(一个用户可拥有多篇文章)
Daily.belongsTo(User, { foreignKey: 'userId', as: 'userInfo'})

module.exports = Daily