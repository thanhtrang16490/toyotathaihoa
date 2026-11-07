const config = {
  trailingSlash:true,
  skipTrailingSlashRedirect:true,
  images:{formats:['image/webp']},
  async rewrites(){
    return {
      beforeFiles:[],
      afterFiles:[{
        source:'/media/:asset([a-f0-9]{16}).:extension(jpg|jpeg|png)',
        destination:'/media/:asset.webp',
      }],
      fallback:[],
    }
  },
}
export default config
