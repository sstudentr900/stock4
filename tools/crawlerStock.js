require('dotenv').config(); //載入.env環境檔
const { initDrive } = require("./initDrive.js");
const { By, until,Select } = require('selenium-webdriver') // 從套件中取出需要用到的功能
const { dbQuery,dbInsert,dbUpdata,dbDelete,timeFn } = require('./db.js')
const web = 'https://www.tdcc.com.tw/portal/zh/smWeb/qryStock';
async function getTrace({dr,row,date,i}) {
  //當前日期
  // const options = await dr.findElements(By.css('#scaDate option'))
  // const date = await options[i].getText()
  //填入資訊
  const selects = new Select(await dr.findElement(By.name('scaDate')))
  await selects.selectByIndex(i)
  const StockNo_el = await dr.wait(until.elementLocated(By.xpath(`//*[@id="StockNo"]`)));
  StockNo_el.sendKeys( row['stockno'] )
  //點擊
  const serch_el = await dr.findElement(By.xpath("//input[@value='查詢']"))
  serch_el.click()
  await dr.sleep(3000)
  //抓取內容
  const trs = await dr.findElements(By.css('.table-responsive tbody tr'))
  // console.log(`getTrace抓取內容數量:${ trs.length }`)
  const array = []
  for (let tr of trs) {
    const obj = {}
    let tds = await tr.findElements(By.css('td'))
    obj.stockno = row['stockno']
    obj.date = date
    obj.id = await tds[0].getText()
    obj.grading = await tds[1].getText()
    obj.peoplenumber = await tds[2].getText()
    obj.stocknumber = await tds[3].getText()
    obj.proportion = await tds[4].getText()
    // console.log('obj',obj)
    array.push(obj)
  }
  // console.log(41,array)
  return array
}
async function getDate({dr,row}) {
  //資料最後日期
  let dataLastDate = ''; 
  if(row['peoplenumber']){
    const peoplenumber = JSON.parse(row['peoplenumber'])
    dataLastDate = peoplenumber[peoplenumber.length-1]['date']
  }

  //抓日期
  const options = await dr.findElements(By.css('#scaDate option'))

  //跑全部日期
  const array = []
  for (let i = 0; i < options.length; i++) {
  // for (let i = 0; i < 2; i++) {
    await dr.get(web)
    const optionsnew = await dr.findElements(By.css('#scaDate option'))
    const date = await optionsnew[i].getText()
    if(dataLastDate>=date){
      console.log(`getDate 日期${dataLastDate}小於抓取日期${date},${dataLastDate>=date}`)
      break;
    }
    const data = await getTrace({
      dr: dr,
      row:row,
      date: date,
      i:i
    })
    // console.log(50,array)
    array.unshift(...data)
    // console.log(51,array)
    await dr.sleep(3000)
  }

  return array;
}
async function start() {    
  const driver = await initDrive()
  await driver.manage().window().setRect({ width: 1420, height: 1200 });
  await driver.get(web)
  //sql
  const rows = await dbQuery( 'SELECT * from stock' )
  if(!rows){console.log(`start sql 失敗跳出`)}
  for (const [index, row] of rows.entries()) {
    console.log('start',row['stockno'])
    //抓取資料
    let datas = await getDate({
      dr: driver,
      row:row,
    })
    // console.log(data)

    //資料判斷
    const result = {}
    if(row['peoplenumber']){
      const peoplenumber = JSON.parse(row['peoplenumber'])
      for(data of datas){
        console.log(`start,資料庫有值,抓取資料存入`,data)
        peoplenumber.push(data)
      }
      result.peoplenumber = JSON.stringify(peoplenumber)
    }else{
      result.peoplenumber = JSON.stringify(datas)
    }

    //存資料庫
    await dbUpdata('stock',result,row['id'])

    console.log('end',row['stockno'])
  }
  driver.quit();
}
exports.crawlerStock = start;//讓其他程式在引入時可以使用這個函式

