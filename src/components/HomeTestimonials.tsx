const testimonials = [
  {avatar:'minh', name:'Anh Minh', location:'Hà Đông, Hà Nội', title:'Dịch vụ tốt!', review:'Anh Minh đánh giá cao sự nhiệt tình và chuyên nghiệp của nhân viên. Anh luôn cảm thấy được chào đón khi đến đại lý.'},
  {avatar:'mai-anh', name:'Chị Mai Anh', location:'Mỹ Đình, Hà Nội', title:'Thủ tục nhanh chóng!', review:'Chị Mai Anh hài lòng khi mua xe vì giá cả hợp lý, thủ tục nhanh và được nhân viên hỗ trợ hoàn tất giấy tờ.'},
  {avatar:'hai', name:'Anh Hải', location:'Thanh Xuân, Hà Nội', title:'Showroom hiện đại!', review:'Anh Hải thích không gian hiện đại của đại lý, đặc biệt là khu vực chờ thoải mái và tiện nghi.'},
  {avatar:'minh-trang', name:'Chị Minh Trang', location:'Thanh Xuân, Hà Nội', title:'Lái thử tuyệt vời!', review:'Chị Minh Trang ấn tượng với trải nghiệm lái thử xe ảo và cho biết sẽ giới thiệu chương trình này cho bạn bè.'},
  {avatar:'richard-nguyen', name:'Anh Richard Nguyễn', location:'Cầu Giấy, Hà Nội', title:'Xưởng dịch vụ khá tốt!', review:'Anh Richard Nguyễn yên tâm giao xe cho đội ngũ kỹ thuật viên vì tay nghề, tốc độ và chất lượng sửa chữa.'},
]

const heading = 'Khách hàng nói gì về Toyota Thái Hòa Từ Liêm'
const rows = [testimonials.slice(0,3), testimonials.slice(3)]

export default function HomeTestimonials() {
  return <section id="home-testimonials" className="home-testimonials" aria-labelledby="home-testimonials-title">
    <div className="wrap home-testimonials-intro">
      <h2 id="home-testimonials-title" aria-label={heading}>
        {heading.split(' ').map((word,index)=><span key={index} aria-hidden="true" style={{animationDelay:`${index*45}ms`}}>{word}{' '}</span>)}
      </h2>
      <p>Chia sẻ của khách hàng về trải nghiệm mua xe, lái thử và sử dụng dịch vụ tại đại lý.</p>
    </div>
    {rows.map((row,index)=><div className="home-testimonial-lane" key={index}>
      <div className="home-testimonial-track">
        {[0,1].map(copy=><div className="home-testimonial-group" key={copy} aria-hidden={copy===1 || undefined}>
          {[...row,...row].map(({avatar,name,location,title,review},position)=><article
            key={avatar+position} className="home-testimonial-card" data-repeat={copy===1 || position>=row.length}
            aria-hidden={position>=row.length || undefined}>
            <div className="home-testimonial-author">
              <img src={'/media/testimonials/'+avatar+'.webp'} alt="" width={48} height={48} loading="lazy" />
              <div><strong>{name}</strong><span>{location}</span></div>
            </div>
            <div className="home-testimonial-stars" aria-label="5 trên 5 sao"><span aria-hidden="true">★★★★★</span></div>
            <h3>{title}</h3>
            <p>{review}</p>
          </article>)}
        </div>)}
      </div>
    </div>)}
  </section>
}
