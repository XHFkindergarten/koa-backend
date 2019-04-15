
/**
 * 生成增删查改的sql生成语句
 */
const produceSQL = {
  // 查找
  query: data => {
    let sql = `SELECT * FROM ${data.tableName}`
    const keys = Object.keys(data.params)
    if(keys.length!=0){
      keys.forEach(key => {
        sql += ` WHERE ${key}='${data.params[key]}' AND`
      })
      sql = sql.substring(0,sql.length-4)
    }
    return sql
  },
  // 插入
  insert: data => {
    let sql = `INSERT INTO ${data.tableName}`
    const keys = Object.keys(data.params)
    let keySQL = '('
    keys.forEach(element => {
      keySQL += `${element},`
    });

    keySQL = keySQL.substr(0,keySQL.length-1)+')'
    sql +=keySQL + ' VALUES('
    keys.forEach(element => {
      sql += `'${data.params[element]}',`
    })
    sql = sql.substring(0,sql.length-1) + ')'
    return sql
  },
}

module.exports = produceSQL