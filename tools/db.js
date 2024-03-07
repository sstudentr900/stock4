require('dotenv').config(); //載入.env環境檔
// console.log()
const mysql = require('mysql');
//mysql
const pool = mysql.createPool({
  connectionLimit: 10,//連接數
  host           :  process.env.DB_HOST,
  user           :  process.env.DB_USER,
  password       :  process.env.DB_PASSWORD,
  database       :  process.env.DB_DATABASE,
  charset: 'utf8mb4',
})
async function dbQuery( sql, values ) {
  // console.log(`dbQuery`)
  if(!sql){console.log('sql錯誤');return false;}
  // if(!values){console.log('values錯誤');return false;}
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else { 
        // 執行 sql 腳本對資料庫進行讀寫
        connection.query(sql, values, (err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()  // 結束會話
        })
      }
    })
  })
}
async function dbInsert( dataName ,objs ) {
  // console.log(`dbInsert`)
  if(!dataName){console.log('dataName錯誤');return false;}
  if(!Object.values(objs).length){console.log('objs錯誤');return false;}
  return await dbQuery( `INSERT INTO ${dataName} SET ?`,objs);
}
async function dbUpdata( dataName, objs ,id ) {
  // console.log(`dbUpdata`)
  if(!dataName){console.log('dataName錯誤');return false;}
  if(!Object.values(objs).length){console.log('objs錯誤');return false;}
  if(!id){console.log('id錯誤');return false;}
  const val = []
  const sqlText = []
  Object.entries(objs).forEach((obj) => {
    sqlText.push(obj[0]+' = ?')
    val.push(obj[1])
  });
  val.push(id)
  const sql = `UPDATE ${dataName} SET ${sqlText.join(',')} WHERE id = ?`
  return await dbQuery( sql,val );
}
async function dbDelete( dataName ,id ) {
  console.log('dbDelete',id)
  if(!dataName){console.log('dataName錯誤');return false;}
  if(!id){console.log('id錯誤');return false;}
  // return await dbQuery( `DELETE from ${dataName} WHERE id IN (?)`,[id] );
  return await dbQuery( `DELETE from ${dataName} WHERE FIND_IN_SET (id ,?)`,[id] );
}
async function pageFn( count, pageShow, pageNow ) {
  // console.log(`pageObj`)
  let pageTotle = Number(Math.ceil(count / pageShow));
  let pageStart = Number(pageNow);
  if (pageNow > pageTotle) {
    pageStart = pageTotle;
  } else if (pageNow < 1) {
    pageStart = 1;
  }
  let startValue = (pageStart - 1) * pageShow;
  return {
    'pageStart': pageStart,
    'pageTotle': pageTotle,
    'startValue': startValue,
    'endValue': pageShow,
  }
}
async function timeFn(obj){
  const objDate = obj?.date
  const objDay = obj?.day
  const objYear= obj?.year
  const dt = objDate?new Date(objDate):new Date();
  objDay?dt.setDate(dt.getDate()+Number(objDay)):'';//加減日
  objYear?dt.setFullYear(dt.getFullYear()+Number(objYear)):'';//加減日
  // const year = Number(dt.getFullYear());//取幾年-2022
  // let month = Number(dt.getMonth())+1;//取幾月-8
  // month = month>9?month:'0'+month//08
  const year = dt.getFullYear()+'';
  const month = ('0'+(dt.getMonth()+1)).slice(-2);
  const day = ('0'+dt.getDate()).slice(-2);
  const date = `${year}-${month}-${day}`;
  const hours = ('0'+(dt.getHours())).slice(-2);
  const min = ('0'+(dt.getMinutes())).slice(-2);
  const sec = ('0'+(dt.getSeconds())).slice(-2);
  const time = `${hours}:${min}:${sec}`;
  const datetime = `${date} ${time}`;
  const week = dt.getDay()
  return {
    "year": year,
    "month" :month,
    "day": day,
    "date": date,
    "hours": hours,
    "min": min,
    "sec": sec,
    "time": time,
    "datetime": datetime,
    "week": week,
  }
}
module.exports = { 
  dbQuery,
  dbInsert,
  dbUpdata,
  dbDelete,
  pageFn,
  timeFn,
}