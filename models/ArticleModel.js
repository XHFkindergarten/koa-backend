const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')
const User = require('./UserModel')

const Article = sequelize.define('article', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
  groupId: {
    type: Sequelize.INTEGER,
    field: 'group_id'
  },
  content: Sequelize.TEXT(),
  summary: Sequelize.STRING(255),
  title: Sequelize.STRING(255),
  labelImg: {
    type: Sequelize.STRING(255),
    field: 'label_img'
  },
  createdAt:{
    type: Sequelize.BIGINT,
    field: 'created_at'
  },
  updatedAt: {
    type: Sequelize.BIGINT,
    field: 'updated_at'
  },
  likeNum: {
    type: Sequelize.INTEGER,
    field: 'like_num'
  },
  commentNum: {
    type: Sequelize.INTEGER,
    field: 'comment_num'
  },
  viewTime: {
    field: 'view_time',
    type: Sequelize.INTEGER
  },
  tags: Sequelize.STRING(255)
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})

// 构建和User表的关联关系(一个用户可拥有多篇文章)
Article.belongsTo(User, { foreignKey: 'userId', as: 'userInfo'})

module.exports = Article