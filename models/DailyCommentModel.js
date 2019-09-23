const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')
const User = require('./UserModel')

const DailyComment = sequelize.define('daily_comment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  dailyId: {
    type: Sequelize.INTEGER, 
    field: 'daily_id'
  },
  userId: {
    type: Sequelize.INTEGER, 
    field: 'user_id'
  },
  delete: Sequelize.INTEGER,
  replyTo: {
    type: Sequelize.INTEGER, 
    field: 'reply_to'
  },
  content: Sequelize.STRING(255),
  commentAt: {
    type: Sequelize.BIGINT,
    field: 'comment_at'
  }
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})
// 构建和User表的关联关系(一个用户可拥有多条评论)
DailyComment.belongsTo(User, { foreignKey: 'userId', as: 'userInfo'})
DailyComment.belongsTo(User, { foreignKey: 'replyTo', as: 'reply'})

module.exports = DailyComment