// 引入mysql
const mysql = require('mysql')
// 引入连接池配置
const config = require('../config/default').database
// 创建连接池
const pool = mysql.createPool({
  host:config.HOST,
  user:config.USER,
  password:config.PASSWORD,
  database:config.DATABASE
})

// 创建Mysql类
class Mysql{
  // 构造方法(制定查询的表名)
  constructor(){

  }
  // 查询方法
  query(sql){
    // 返回一个promise对象
    return new Promise((resolve,reject)=>{
      // 只是作为样例查询cats表
      pool.query(sql, function ( error, res, fields ) {
        if (error) {
          throw error
        }
        resolve(res)
        // console.log('query res:',res)
      })
    })
  }
}

module.exports = Mysql