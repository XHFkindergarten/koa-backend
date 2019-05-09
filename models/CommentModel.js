const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')
const User = require('./UserModel')

const Comment = sequelize.define('article_comment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
  articleId: {
    type: Sequelize.INTEGER,
    field: 'article_id'
  },
  likeNum: {
    type: Sequelize.INTEGER,
    field: 'like_num'
  },
  commentNum: {
    type: Sequelize.INTEGER,
    field: 'comment_num'
  },
  content: Sequelize.INTEGER,
  time: Sequelize.BIGINT
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})
// 联表
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'from'})


module.exports = Comment