// 引入mysql
const mysql = require('mysql')
// 引入连接池配置
const config = require('../config/default').database
// 创建连接池
const pool = mysql.createPool(config)

// TODO优化一下sql查询的结构，最好做成yii2那样
// 创建Mysql类
class Mysql{
  // 构造方法(制定查询的表名)
  constructor(){

  }
  // 执行sql语句方法
  query(sql){
    // 返回一个promise对象
    return new Promise((resolve,reject)=>{
      pool.query(sql, function ( error, res, fields ) {
        if (error) {
          throw error
        }
        resolve(res)
      })
    })
  }
}

module.exports = Mysql