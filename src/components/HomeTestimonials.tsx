'use client'

import {useState} from 'react'

const testimonials = [
  {avatar:'minh', name:'Anh Minh', location:'Hà Đông, Hà Nội', title:'Dịch vụ tốt!', review:'Anh Minh đánh giá cao sự nhiệt tình và chuyên nghiệp của nhân viên. Anh luôn cảm thấy được chào đón khi đến đại lý.'},
  {avatar:'mai-anh', name:'Chị Mai Anh', location:'Mỹ Đình, Hà Nội', title:'Thủ tục nhanh chóng!', review:'Chị Mai Anh hài lòng khi mua xe vì giá cả hợp lý, thủ tục nhanh và được nhân viên hỗ trợ hoàn tất giấy tờ.'},
  {avatar:'hai', name:'Anh Hải', location:'Thanh Xuân, Hà Nội', title:'Showroom hiện đại!', review:'Anh Hải thích không gian hiện đại của đại lý, đặc biệt là khu vực chờ thoải mái và tiện nghi.'},
  {avatar:'minh-trang', name:'Chị Minh Trang', location:'Thanh Xuân, Hà Nội', title:'Lái thử tuyệt vời!', review:'Chị Minh Trang ấn tượng với trải nghiệm lái thử xe ảo và cho biết sẽ giới thiệu chương trình này cho bạn bè.'},
  {avatar:'richard-nguyen', name:'Anh Richard Nguyễn', location:'Cầu Giấy, Hà Nội', title:'Xưởng dịch vụ khá tốt!', review:'Anh Richard Nguyễn yên tâm giao xe cho đội ngũ kỹ thuật viên vì tay nghề, tốc độ và chất lượng sửa chữa.'},
]

export default function HomeTestimonials() {
  const [active,setActive]=useState(0)
  const {avatar,name,location,title,review}=testimonials[active]
  function move(direction:number) {
    setActive(current=>(current+direction+testimonials.length)%testimonials.length)
  }

  return <section id="home-testimonials" className="home-testimonials" aria-labelledby="home-testimonials-title">
    <div className="wrap">
      <h2 id="home-testimonials-title">Khách hàng nói gì về Toyota Thái Hòa Từ Liêm</h2>
      <div id="home-testimonial-review" className="home-testimonial-stage" aria-live="polite">
        <article key={avatar} className="home-testimonial-card">
          <img className="home-testimonial-portrait" src={'/media/testimonials/'+avatar+'.webp'} alt="" width={240} height={240} loading="lazy" />
          <div>
            <div className="home-testimonial-stars">
              <span aria-hidden="true">★★★★★</span><span className="home-testimonial-score">5/5 sao</span>
            </div>
            <h3>{title}</h3>
            <p>{review}</p>
            <div className="home-testimonial-author"><strong>{name}</strong><span>{location}</span></div>
          </div>
        </article>
      </div>
      <div className="home-testimonial-controls" role="group" aria-label="Chọn đánh giá">
        <button type="button" className="home-testimonial-arrow" aria-label="Đánh giá trước" onClick={()=>move(-1)}>←</button>
        {testimonials.map((item,index)=><button key={item.avatar} type="button" className="home-testimonial-picker"
          aria-label={'Xem đánh giá của '+item.name} aria-pressed={index===active}
          aria-controls="home-testimonial-review" onClick={()=>setActive(index)}>
          <img src={'/media/testimonials/'+item.avatar+'.webp'} alt="" width={40} height={40} loading="lazy" />
        </button>)}
        <button type="button" className="home-testimonial-arrow" aria-label="Đánh giá tiếp theo" onClick={()=>move(1)}>→</button>
      </div>
    </div>
  </section>
}
