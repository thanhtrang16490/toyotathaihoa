
import Image from 'next/image'
import {pendingTrimVerification, isUsedVehicle} from '../catalog'
import type {Entry} from '../catalog'
import styles from './showroom-pages.module.css'
export default function Card({entry, vehicle = false, wide = false, heading: Heading = "h3", editorial}: {entry:Entry,vehicle?:boolean,wide?:boolean,heading?:"h2"|"h3";editorial?:"lead"|"article"|"service"}) {
const image = entry.image
const className = ['card',vehicle && 'vehicle',editorial && styles.editorialCard].filter(Boolean).join(' ')
return (<article className={className} data-editorial={editorial}>
<a href={entry.slug} className="card-link">
  {image ? <Image className="card-img" src={image} width={640} height={400} sizes={editorial==='lead' ? '(max-width: 760px) 88vw, 55vw' : editorial==='service' ? '(max-width: 560px) 88vw, 43vw' : editorial==='article' ? '(max-width: 560px) 88vw, (max-width: 760px) 43vw, 29vw' : wide ? "(max-width: 600px) calc(100vw - 32px), (max-width: 960px) 50vw, 420px" : "(max-width: 640px) 50vw, (max-width: 960px) 33vw, 300px"} alt="" /> : entry.image && <img className="card-img" src={entry.image} alt="" loading="lazy" decoding="async" width="640" height="400" />}
  <div className="card-body">
    {entry.category && editorial!=='service' && <span className="eyebrow">{entry.category}</span>}
    {editorial && editorial!=='service' && entry.published && <time dateTime={entry.published}>{new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium',timeZone:'Asia/Ho_Chi_Minh'}).format(new Date(entry.published))}</time>}
    <Heading className="card-title">{entry.title}</Heading>
    {editorial==='lead' && <span className={styles.cardCta}>Đọc bài viết ↗</span>}
    {editorial==='service' && <span className={styles.cardCta}>Tìm hiểu thêm ↗</span>}
    {vehicle && <p>{!pendingTrimVerification.has(entry.slug) && !isUsedVehicle(entry) && entry.price || 'Liên hệ để nhận báo giá'}</p>}
    {vehicle && wide ? <span className="vehicle-card-action">Khám phá xe <span aria-hidden="true">↗</span></span> : <span className="card-arrow" aria-hidden="true">↗</span>}
  </div>
</a>
</article>)
}
