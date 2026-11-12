import SiteFrame from '../../components/SiteFrame'
import {entries,accessoryPaths,collections} from '../../catalog'
import {getPublicCars,getPublishedNews} from '../../site-content'

export const metadata = {title:'Tìm kiếm',robots:{index:false,follow:true}}

function normalize(value:string) {
  return value.toLocaleLowerCase('vi').normalize('NFD').replace(/\p{M}/gu,'').replaceAll('đ','d')
}

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string|string[]}>}) {
  const {q} = await searchParams
  const query = typeof q==='string' ? q.trim().slice(0,100) : ''
  const [cars,news] = query ? await Promise.all([getPublicCars(),getPublishedNews()]) : [[],[]]
  const terms = normalize(query).split(/\s+/)
  const results = query ? [
    ...cars,...entries.filter(entry=>accessoryPaths.has(entry.slug) && entry.kind==='product'),
    ...Object.entries(collections).map(([slug,title])=>({slug,title,description:''})),
    ...entries.filter(entry=>entry.kind==='page' || entry.kind==='product_cat'),
    ...news,
  ] : []
  const unique = new Map(results.map(entry=>[entry.slug,entry]))
  const matches = [...unique.values()].filter(entry=>{
    const content = normalize(entry.title+' '+entry.description)
    return terms.every(term=>content.includes(term))
  }).sort((a,b)=>Number(normalize(b.title).includes(normalize(query)))-Number(normalize(a.title).includes(normalize(query))))

  return <SiteFrame title="Tìm kiếm" path="/tim-kiem/" noindex>
    <section className="wrap section site-search-page">
      <h1>Tìm kiếm</h1>
      <form action="/tim-kiem/" role="search" aria-label="Tìm trên website">
        <label htmlFor="site-query">Tên xe, phụ kiện, dịch vụ hoặc bài viết</label>
        <div><input id="site-query" name="q" type="search" maxLength={100} defaultValue={query} required />
        <button className="btn" type="submit">Tìm kiếm</button></div>
      </form>
      {query && (matches.length ? <>
        <p>{matches.length>30 ? '30 kết quả đầu tiên' : matches.length+' kết quả'} cho “{query}”</p>
        <ul>{matches.slice(0,30).map(entry=><li key={entry.slug}><a href={entry.slug}>{entry.title}</a></li>)}</ul>
      </> : <p>Không tìm thấy kết quả cho “{query}”. Hãy thử tên dòng xe hoặc từ khóa ngắn hơn.</p>)}
    </section>
  </SiteFrame>
}
