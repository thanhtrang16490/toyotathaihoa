'use client'

import Image from 'next/image'
import {useState} from 'react'
import type {Entry} from '../catalog'
import styles from './home-news.module.css'

type NewsEntry = Pick<Entry, 'slug' | 'title' | 'description' | 'image' | 'published' | 'category'> & {topics: string[]}

const dateFormat = new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium',timeZone:'Asia/Ho_Chi_Minh'})

function NewsCard({entry, featured=false}:{entry:NewsEntry; featured?:boolean}) {
  const date = new Date(entry.published)
  return <article className={styles.card} data-featured={featured}>
    <a href={entry.slug}>
      {entry.image && <div className={styles.photo}>
        <Image src={entry.image} alt="" fill sizes={featured
          ? '(max-width: 760px) 92vw, 640px'
          : '(max-width: 560px) 92vw, (max-width: 900px) 46vw, 420px'} />
      </div>}
      <div className={styles.copy}>
        {(entry.topics[0] || entry.category) && <span className={styles.badge}>{entry.topics[0] || entry.category}</span>}
        <h3>{entry.title}</h3>
        {entry.description && <p>{entry.description}</p>}
        {!Number.isNaN(date.getTime()) && <time dateTime={date.toISOString()}>{dateFormat.format(date)}</time>}
        <span className={featured ? 'btn' : styles.read}>Đọc bài viết <span aria-hidden="true">→</span></span>
      </div>
    </a>
  </article>
}

export default function HomeNews({articles}:{articles:NewsEntry[]}) {
  const [active,setActive] = useState('')
  const [featured,...posts] = articles
  if (!featured) return null
  const categories = [...new Set(posts.flatMap(post=>post.topics.length ? post.topics : [post.category]).filter(Boolean))]
  const visible = active ? posts.filter(post=>post.topics.includes(active) || post.category===active) : posts
  return <section id="home-news" className="home-news" aria-labelledby="home-news-title">
    <div className="wrap">
      <h2 id="home-news-title">Tin tức mới nhất</h2>
      <p className={styles.lead}>Cập nhật tin xe Toyota, hoạt động đại lý và kinh nghiệm chăm sóc xe.</p>
      <NewsCard entry={featured} featured />
      {categories.length>0 && <div className={styles.filters} role="group" aria-label="Lọc theo chủ đề">
        {['',...categories].map(category=><button type="button" key={category} aria-pressed={active===category}
          onClick={()=>setActive(category)}>{category || 'Tất cả'}</button>)}
      </div>}
      <div className={styles.grid}>
        {visible.map(entry=><NewsCard key={entry.slug} entry={entry} />)}
      </div>
      <a className="btn outline home-news-all" href="/tin-tuc/">Xem tất cả tin tức <span aria-hidden="true">↗</span></a>
    </div>
  </section>
}
