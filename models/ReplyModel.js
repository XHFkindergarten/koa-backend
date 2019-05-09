const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')
const User = require('./UserModel')

const Reply = sequelize.define('reply', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  commentId: {
    field: 'comment_id',
    type: Sequelize.INTEGER
  },
  articleId: {
    field: 'article_id',
    type: Sequelize.INTEGER
  },
  userId: {
    field: 'user_id',
    type: Sequelize.INTEGER
  },
  content: Sequelize.STRING(255),
  time: Sequelize.BIGINT
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})
// 联表
Reply.belongsTo(User, { foreignKey: 'user_id', as: 'from'})

module.exports = Reply