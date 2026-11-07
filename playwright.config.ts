import {defineConfig,devices} from '@playwright/test'
export default defineConfig({
  testDir:'tests',
  workers:2,
  use:{baseURL:'http://127.0.0.1:4321',channel:'chrome'},
  projects:[
    {name:'desktop',use:{viewport:{width:1440,height:900}}},
    {name:'mobile',use:{...devices['Pixel 7'],defaultBrowserType:'chromium'}},
  ],
})
