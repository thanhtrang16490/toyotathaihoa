import {chromium} from '@playwright/test'
import fs from 'node:fs/promises'
const origin = 'https://toyotathaihoatuliem.com.vn'
const browser = await chromium.launch({channel:'chrome'})
const output=[]
try {
  for(const path of ['/','/toyota/corolla-cross/']){
    const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true})
    const requests=new Map()
    page.on('response',r=>requests.set(r.url(),{status:r.status(),type:r.headers()['content-type']}))
    const result={url:origin+path,interactions:[],requests:[]}
    try{
      result.status=(await page.goto(result.url,{waitUntil:'commit',timeout:30000}))?.status()
      await page.locator(path==='/'?'#goal-main-content':'h1').first().waitFor({state:'attached',timeout:30000})
      await page.evaluate(async()=>{for(let y=0;y<Math.min(document.body.scrollHeight,14000);y+=750){scrollTo(0,y);await new Promise(r=>setTimeout(r,80))}})
      for(const selector of ['.woocommerce-product-gallery__image a','a[href="#thongso"]','.additional_information_tab a','.description_tab a','.variations_form select']){
        const target=page.locator(selector).first()
        if(await target.count()){
          const visible=await target.isVisible()
          let interacted=false
          if(visible){
            try{
              if(selector.endsWith('select')) await target.selectOption({index:1},{timeout:3500})
              else {
                await target.click({timeout:3500,noWaitAfter:true})
                if(selector.includes('gallery')) await page.keyboard.press('Escape')
              }
              interacted=true
            }catch{}
          }
          result.interactions.push({selector,visible,interacted})
        }
      }
      result.forms=await page.locator('form').count()
      result.tables=await page.locator('table').count()
      await fs.writeFile('source-assets/rendered-'+(path==='/'?'home':'corolla-cross')+'.html',await page.content())
    }catch(error){result.error=String(error)}
    result.requests=[...requests]
    output.push(result)
    await page.close()
  }
} finally {
  await fs.writeFile('source-assets/browser-audit.json',JSON.stringify(output,null,2))
  await browser.close()
}
