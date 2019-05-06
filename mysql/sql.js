
/**
 * 生成增删查改的sql生成语句
 */
const produceSQL = {
  /**
   * @description 生成查询sql语句
   * @param tableName 修改的表名
   * @param params 查询条件
   */
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
 /**
   * @description 生成插入sql语句
   * @param tableName 修改的表名
   * @param params 要插入的整行数据 columnName: columnValue
   */
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

   /**
   * @description 生成修改sql语句
   * @param tableName 修改的表名
   * @param where 筛选条件
   * @param params 修改的数据
   */
  update: data => {
    let sql = `UPDATE ${data.tableName} `
    // 修改的数据
    const keys = Object.keys(data.params)
    let keySQL = 'SET '
    keys.forEach(element => {
      keySQL += `${element} = '${data.params[element]}',`
    })
    keySQL = keySQL.substring(0, keySQL.length-1)
    // 筛选的条件
    let whereSQL = 'WHERE '
    const whereKeys = Object.keys(data.where)
    whereKeys.forEach(element => {
      whereSQL += `${element} = '${data.where[element]}',`
    })
    whereSQL = whereSQL.substring(0, whereSQL.length-1)
    // SQL语句组装
    sql += `${keySQL} ${whereSQL}`
    return sql
  },
  /**
   * @description 生成删除sql语句
   * @param tableName 修改的表名
   * @param where 筛选条件
   */
  delete: data => {
    let sql = `DELETE FROM ${data.tableName} `
    // 筛选条件
    let whereSQL = 'WHERE '
    const whereKeys = Object.keys(data.where)
    whereKeys.forEach(element => {
      whereSQL += `${element} = '${data.where[element]}',`
    })
    whereSQL = whereSQL.substring(0, whereSQL.length-1)
    // 组装SQL语句
    sql +=whereSQL
    return sql
  },

  /**
   * @description 生成count语句
   * @param tableName 表名
   * @param params 筛选条件
   */
  count: data => {
    let sql = `SELECT COUNT(*) FROM ${data.tableName} AS LENGTH `
    const keys = Object.keys(data.params)
    let keysSQL = 'WHERE '
    keys.forEach(element => {
      keysSQL += `${element} = ${data.params[element]}`
    })
    return sql + keysSQL
  }
}

   

module.exports = produceSQL