
import Image from 'next/image'
import {pendingTrimVerification, isUsedVehicle} from '../catalog'
import type {Entry} from '../catalog'
export default function Card({entry, vehicle = false, wide = false, heading: Heading = "h3"}: {entry:Entry,vehicle?:boolean,wide?:boolean,heading?:"h2"|"h3"}) {
const image = entry.image
return (<article className={vehicle ? "card vehicle" : "card"}>
<a href={entry.slug} className="card-link">
  {image ? <Image className="card-img" src={image} width={640} height={400} sizes={wide ? "(max-width: 600px) calc(100vw - 32px), (max-width: 960px) 50vw, 420px" : "(max-width: 640px) 50vw, (max-width: 960px) 33vw, 300px"} alt="" /> : entry.image && <img className="card-img" src={entry.image} alt="" loading="lazy" decoding="async" width="640" height="400" />}
  <div className="card-body">
    {entry.category && <span className="eyebrow">{entry.category}</span>}
    <Heading className="card-title">{entry.title}</Heading>
    {vehicle && <p>{!pendingTrimVerification.has(entry.slug) && !isUsedVehicle(entry) && entry.price || 'Liên hệ để nhận báo giá'}</p>}
    {vehicle && wide ? <span className="vehicle-card-action">Khám phá xe <span aria-hidden="true">↗</span></span> : <span className="card-arrow" aria-hidden="true">↗</span>}
  </div>
</a>
</article>)
}
