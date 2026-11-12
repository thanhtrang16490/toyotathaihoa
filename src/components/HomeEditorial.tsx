import {address,dealer,directions,hours,type Entry} from '../catalog'
import Image from 'next/image'
import HomeVisitTabs from './HomeVisitTabs'
import VehicleVideo from './VehicleVideo'

export function HomeAbout() {
  return <section id="home-about" className="home-about" aria-labelledby="home-about-title">
    <div className="wrap home-about-layout">
      <div className="home-about-copy">
        <p className="eyebrow">Giới thiệu đại lý</p>
        <h2 id="home-about-title">{dealer}</h2>
        <div className="home-about-description">
          <p className="home-about-lead">Đại lý chính hãng Toyota Việt Nam tại Đại Mỗ, Hà Nội, từ năm 2018.</p>
          <p>Ghé showroom để xem xe, so sánh các phiên bản và đăng ký lái thử. Khi cần chăm sóc xe, bạn có thể đặt lịch bảo dưỡng tại cùng địa chỉ.</p>
        </div>
        <HomeVisitTabs address={address} directions={directions} hours={hours} />
      </div>
      <div className="home-about-video">
        <VehicleVideo id="nkX20BQCJPY" title={dealer} thumbnail="https://i.ytimg.com/vi/nkX20BQCJPY/maxresdefault.jpg"
          caption="Xem video giới thiệu" />
      </div>
      <a className="btn outline home-about-link" href="/gioi-thieu/">Tìm hiểu về đại lý <span aria-hidden="true">↗</span></a>
    </div>
  </section>
}

const newsDate = new Intl.DateTimeFormat('vi-VN',{dateStyle:'medium',timeZone:'Asia/Ho_Chi_Minh'})

export function HomeNews({articles}:{articles:Entry[]}) {
  if (!articles.length) return null
  return <section id="home-news" className="home-news" aria-labelledby="home-news-title">
    <div className="wrap home-news-layout">
      <h2 id="home-news-title">Tin tức mới nhất</h2>
      <div className="home-news-grid">
        {articles.map((entry,index)=>{
          const featured=index===0
          const date=new Date(entry.published)
          return <article key={entry.slug} className="home-news-story" data-featured={featured} data-image={Boolean(entry.image)}>
            <a href={entry.slug}>
              {entry.image && <div className="home-news-photo">
                <Image src={entry.image} alt="" fill sizes={featured ? '(max-width: 760px) 92vw, 58vw' : '(max-width: 420px) 28vw, 170px'} />
              </div>}
              <div className="home-news-story-copy">
                <div className="home-news-meta">
                  {entry.category && <span>{entry.category}</span>}
                  {!Number.isNaN(date.getTime()) && <time dateTime={date.toISOString()}>{newsDate.format(date)}</time>}
                </div>
                <h3>{entry.title}</h3>
                {featured && entry.description && <p>{entry.description}</p>}
                <span className="home-news-arrow" aria-hidden="true">↗</span>
              </div>
            </a>
          </article>
        })}
      </div>
      <a className="btn outline home-news-all" href="/tin-tuc/">Xem tất cả tin tức <span aria-hidden="true">↗</span></a>
    </div>
  </section>
}
