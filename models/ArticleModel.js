const Sequelize = require('sequelize')
const sequelize = require('../mysql/sequelize')

const Article = sequelize.define('article', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  userId: Sequelize.INTEGER,
  groupId: Sequelize.INTEGER,
  content: Sequelize.TEXT,
  title: Sequelize.STRING(255),
  label_img: Sequelize.STRING(255),
  createdAt: Sequelize.BIGINT,
  updatedAt: Sequelize.BIGINT
},{
  // 不要擅自添加时间戳属性
  timestamps: false,
  // 不要擅自将表名变为复数
  freezeTableName: true
})

module.exports = Article