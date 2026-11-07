import lighthouse from 'lighthouse'
import {launch} from 'chrome-launcher'
import fs from 'node:fs/promises'
const chrome = await launch({chromeFlags:['--headless','--disable-dev-shm-usage']})
const paths = ['/', '/xe-toyota-moi/', '/toyota/corolla-cross/', '/dich-vu/', '/tin-tuc/', '/nhan-bao-gia/']
const results=[]
try {
  for(const path of paths){
    const result=await lighthouse('http://127.0.0.1:4321'+path,{port:chrome.port,output:'json',onlyCategories:['performance','accessibility'],logLevel:'error'})
    const {lhr}=result
    results.push({
      path,
      status:lhr.runtimeError?.message||'measured',
      performance:Math.round(lhr.categories.performance.score*100),
      accessibility:Math.round(lhr.categories.accessibility.score*100),
      lcpMs:Math.round(lhr.audits['largest-contentful-paint'].numericValue),
      tbtMs:Math.round(lhr.audits['total-blocking-time'].numericValue),
      cls:lhr.audits['cumulative-layout-shift'].numericValue,
      lighthouse:lhr.lighthouseVersion,
      userAgent:lhr.environment.hostUserAgent,
      throttlingMethod:lhr.configSettings.throttlingMethod,
      formFactor:lhr.configSettings.formFactor,
      throttling:lhr.configSettings.throttling,
    })
    await fs.writeFile('lighthouse-mobile.json',JSON.stringify(results,null,2)+'\n')
  }
} finally {chrome.kill()}
