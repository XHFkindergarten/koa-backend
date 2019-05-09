const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')

const Like = sequelize.define('like', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  userId: {
    field: 'user_id',
    type: Sequelize.INTEGER
  },
  articleId: {
    field: 'article_id',
    type: Sequelize.INTEGER
  },
  time: Sequelize.BIGINT
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})

module.exports = Like