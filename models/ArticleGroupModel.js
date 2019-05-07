const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')

const ArticleGroup = sequelize.define('articleGroup', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: Sequelize.STRING(255),
  userId: Sequelize.INTEGER,
  createdAt: Sequelize.BIGINT,
  updatedAt: Sequelize.BIGINT
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})

module.exports = ArticleGroup