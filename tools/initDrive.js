const webdriver = require('selenium-webdriver'); // 加入虛擬網頁套件
const chrome = require('selenium-webdriver/chrome');
exports.initDrive = initDrive;//讓其他程式在引入時可以使用這個函式
// async function initDrive() {
//   // 建立這個browser的類型
//   const options = new chrome.Options();
//   //抑制usb驅動錯誤
//   options.excludeSwitches("enable-logging")
//   //因為FB會有notifications干擾到爬蟲，所以要先把它關閉
//   options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 1 });
//   //不加載圖片提高效率
//   // options.addArguments('blink-settings=imagesEnabled=false')

//   //瀏覽器不提供頁面觀看，linux下如果系統是純文字介面不加這條會啓動失敗
//   // options.addArguments('--headless')

//   //這個option可以讓你跟headless時網頁端的console.log說掰掰
//   // options.addArguments('--log-level=3')

//   //下面參數能提升爬蟲穩定性    
//   //使用共享內存RAM
//   options.addArguments('--disable-dev-shm-usage')
  
//   //規避部分chrome gpu bug
//   options.addArguments('--disable-gpu')
  
//   return await new webdriver.Builder().forBrowser("chrome").withCapabilities(
//     options,
//     { acceptSslCerts: true, acceptInsecureCerts: true }//解決跨網域問題
//   ).build();
// }
async function initDrive() {
  // 建立這個browser的類型
  const options = new chrome.Options();
  //抑制usb驅動錯誤
  options.excludeSwitches("enable-logging")
  //因為FB會有notifications干擾到爬蟲，所以要先把它關閉
  options.setUserPreferences({ 'profile.default_content_setting_values.notifications': 1 });
  //不加載圖片提高效率
  // options.addArguments('blink-settings=imagesEnabled=false')

  //瀏覽器不提供頁面觀看，linux下如果系統是純文字介面不加這條會啓動失敗
  // options.addArguments('--headless')

  //這個option可以讓你跟headless時網頁端的console.log說掰掰
  // options.addArguments('--log-level=3')

  //下面參數能提升爬蟲穩定性    
  //使用共享內存RAM
  options.addArguments('--disable-dev-shm-usage')
  
  //規避部分chrome gpu bug
  options.addArguments('--disable-gpu')

  //執行本地chrome
  // C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe
  // const service = new chrome.ServiceBuilder('C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe').build();
  // chrome.setDefaultService(service)

  // 無痕模式
  // options.addArguments("--incognito")

  //使用者的資料
  options.addArguments('--user-data-dir=C:/Users/sstud/AppData/Local/Google/Chrome/User Data2/')
  //chrom使用者
  options.addArguments('--profile-directory=Profile 4')


  return await new webdriver.Builder()
  .setChromeOptions(options)
  // .forBrowser("chrome")
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

  // return await new webdriver.Builder().forBrowser("chrome").withCapabilities(
  //   options,
  //   { acceptSslCerts: true, acceptInsecureCerts: true }//解決跨網域問題
  // ).build();
}
