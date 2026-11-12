import data from './data.json'

export interface Entry {
  slug: string
  kind: string
  title: string
  description: string
  price: string
  category: string
  image: string
  gallery: string[]
  archiveLinks?: string[]
  links?: string[]
  taxonomy?: string[]
  specifications?: {rows: {cells: string[]}[]}[]
  variants?: {options: Record<string,string>,price:number,image:string}[]
  html: string
  source: string
  date: string
  published: string
}

export const entries: Entry[] = data.records
export const dealer = 'Toyota Thái Hòa Từ Liêm'
export const phone = '0985333388'
export const servicePhone = '0981555588'
export const contactNumbers = [
  ['Xe mới',phone,'0985 3333 88'],
  ['Xe đã qua sử dụng','0936313338','093 631 3338'],
  ['Dịch vụ',servicePhone,'0981 5555 88'],
  ['Chăm sóc khách hàng','02433549999','024 3354 9999'],
] as const
export const address = 'Ngã ba Tố Hữu – Mộ Lao, Tổ dân phố số 02 Ngọc Trục, Phường Đại Mỗ, TP. Hà Nội'
export const directions = 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(dealer+' '+address)
export const hours = [
  'Bán hàng · Thứ 2–Chủ nhật, 08:00–18:00',
  'Dịch vụ · Thứ 2–Thứ 6, 07:30–18:00',
  'Dịch vụ · Thứ 7, 07:30–17:00',
]
const models = ['toyota-land-cruiser-fj','yaris-cross','corolla-cross','vios','innova-cross','hilux','camry','fortuner','raize','wigo','veloz-cross','avanza-premio','toyota-land-prado','alphard']
export const cars = models.flatMap(model=>entries.filter(entry=>entry.slug==='/toyota/'+model+'/'))
export const news = entries.filter(entry=>entry.kind==='post').sort((a,b)=>b.published.localeCompare(a.published))
export const accessoryCategories = entries.filter(entry=>entry.kind==='product_cat' && entry.slug.startsWith('/danh-muc/phu-kien-toyota/'))
export const accessoryPaths = new Set(entries.filter(entry=>entry.kind==='product' && entry.category==='Phụ kiện Toyota').map(entry=>entry.slug))
export const services = entries.filter(entry=>/^\/(dich-vu-|toyota-touch|bao-hiem-toyota|phu-kien-chinh-hang)/.test(entry.slug))
export const collections = {
  '/xe-toyota-moi/': 'Xe Toyota mới',
  '/xe-da-qua-su-dung/': 'Xe đã qua sử dụng',
  '/dich-vu/': 'Dịch vụ Toyota',
  '/tin-tuc/': 'Tin tức Toyota',
  '/uu-dai/': 'Chương trình ưu đãi',
  '/contact/': 'Liên hệ đại lý',
  '/dat-lich-dich-vu/': 'Đặt lịch bảo dưỡng',
  '/dang-ky-lai-thu/': 'Đăng ký lái thử',
  '/nhan-bao-gia/': 'Nhận báo giá',
  '/thong-tin-xu-ly-du-lieu/': 'Thông tin xử lý dữ liệu',
}
export const redirects = {
  '/lien-he/':'/contact/',
  '/home-6/':'/',
  '/corolla-cross-18v-car,749/':'/toyota/corolla-cross/',
  '/toyota/corolla-altis/':'/xe-toyota-moi/',
  '/dich-vu-dong-son/':'/dich-vu-dong-son-toyota/',
} as const

export const articlesPerPage = 10
export function articlesInArchive(path:string, articles = news){
  if(path==='/tin-tuc/') return articles
  if(path==='/uu-dai/') return articles.filter(entry=>/khuyen-mai|uu-dai/.test(entry.slug))
  const category=entries.find(entry=>entry.kind==='category' && entry.slug===path)
  if(!category) return undefined
  const term=path.split('/').filter(Boolean).at(-1)
  return articles.filter(entry=>term && entry.taxonomy?.includes(term))
}
export function archivePages(articles = news) {
  return ['/tin-tuc/','/uu-dai/',...entries.filter(entry=>entry.kind==='category').map(entry=>entry.slug)]
    .flatMap(path=>Array.from({length:Math.max(0,Math.ceil((articlesInArchive(path, articles)?.length||0)/articlesPerPage)-1)},(_,index)=>path+'page/'+(index+2)+'/'))
}
export const pagination = archivePages()

// These source pages mix trim-level prices or specifications. Restore after dealer verification.
export const pendingTrimVerification = new Set(['/toyota/hilux/','/toyota/corolla-cross/','/toyota/yaris-cross/','/toyota/innova-cross/'])
export const isUsedVehicle = (entry: Entry) => entry.kind === 'product' && /-20\d{2}(?:-\d+)?\/$/.test(entry.slug)

export const noindexPaths = new Set(["/nhan-bao-gia/", "/dang-ky-lai-thu/", "/dat-lich-dich-vu/", "/shop-2/"])
