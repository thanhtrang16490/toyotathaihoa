import {address,dealer,directions,phone} from '../catalog'

export default function SiteFooter() {
  return <footer className="site-footer home-footer">
    <a className="home-back-top" href="#main">↑<br/>Về đầu trang</a>
    <div className="home-footer-region">
      <p className="home-footer-muted">Khu vực / Ngôn ngữ</p>
      <p><span className="home-region-flag" aria-hidden="true">★</span> Việt Nam / Tiếng Việt</p>
    </div>
    <div className="home-footer-columns">
      <section>
        <h2>Địa điểm &amp; Liên hệ</h2>
        <a href="/contact/">Liên hệ đại lý</a>
        <a href={directions} data-event="directions_click">Tìm đường đến showroom</a>
        <a href={'tel:'+phone} data-event="hotline_click">Hotline · 0985 3333 88</a>
      </section>
      <section>
        <h2>Về Toyota Thái Hòa Từ Liêm</h2>
        <a href="/gioi-thieu/">Giới thiệu đại lý</a>
        <a href="/tin-tuc/">Tin tức Toyota</a>
        <a href="/dich-vu/">Dịch vụ chính hãng</a>
        <a href="/dat-lich-dich-vu/">Đặt lịch bảo dưỡng</a>
      </section>
      <section>
        <h2>Khám phá trực tuyến</h2>
        <a href="/">Trang chủ</a>
        <a href="/xe-toyota-moi/">Các dòng xe Toyota</a>
        <a href="/xe-da-qua-su-dung/">Xe đã qua sử dụng</a>
        <a href="/dang-ky-lai-thu/">Đăng ký lái thử</a>
        <a href="/nhan-bao-gia/">Nhận báo giá</a>
        <a href="/gia-lan-banh/">Dự toán giá lăn bánh</a>
        <a href="/gia-lan-banh/?phuongThuc=tra-gop#tra-gop">Dự toán trả góp</a>
      </section>
    </div>
    <div className="home-footer-connect">
      <nav className="home-footer-social" aria-label="Kết nối với đại lý">
        <a href="https://www.facebook.com/toyotathaihoatuliem.com.vn" target="_blank" rel="noopener noreferrer" aria-label="Facebook Toyota Thái Hòa Từ Liêm">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M14 21v-8h3l.5-3H14V8.2c0-.9.3-1.5 1.6-1.5H18V4a21 21 0 0 0-2.5-.2C12.8 3.8 11 5.5 11 8v2H8v3h3v8z"/></svg>
        </a>
        <a href="https://www.youtube.com/@toyotathaihoatuliemofficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube Toyota Thái Hòa Từ Liêm">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M22 12c0 2.5-.2 4.2-.7 5-.5 1-1.5 1.3-3 1.5-1.7.2-4 .2-6.3.2s-4.6 0-6.3-.2c-1.5-.2-2.5-.5-3-1.5-.5-.8-.7-2.5-.7-5s.2-4.2.7-5c.5-1 1.5-1.3 3-1.5 1.7-.2 4-.2 6.3-.2s4.6 0 6.3.2c1.5.2 2.5.5 3 1.5.5.8.7 2.5.7 5Zm-12-3.2v6.4l5.4-3.2L10 8.8Z"/></svg>
        </a>
        <a href="https://zalo.me/0985333388" target="_blank" rel="noopener noreferrer" aria-label="Zalo Toyota Thái Hòa Từ Liêm">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 5.5h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 3v-3H3a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z"/>
            <text x="12" y="14" textAnchor="middle" fill="currentColor" stroke="none" fontSize="7" fontWeight="750">Zalo</text>
          </svg>
        </a>
        <a href="mailto:cskh@toyotathaihoatuliem.com.vn" aria-label="Email chăm sóc khách hàng">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>
        </a>
        <a href={'tel:'+phone} data-event="hotline_click" aria-label="Gọi hotline 0985 3333 88">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round"><path d="M7.2 3 4 4.4c-.9.4-1.2 1.5-1 2.5A19 19 0 0 0 17.1 21c1 .2 2.1-.1 2.5-1l1.4-3.2-4.8-2.1-1.9 2a13.4 13.4 0 0 1-7-7l2-1.9L7.2 3Z"/></svg>
        </a>
      </nav>
      <nav className="home-footer-apps" aria-label="Tải ứng dụng TOYOTA Vietnam">
        <a href="https://apps.apple.com/vn/app/toyota-vietnam/id1546390448" target="_blank" rel="noopener noreferrer" aria-label="Tải TOYOTA Vietnam trên App Store">
          <img src="/media/footer/app-store-vi.svg" alt="" width={120} height={40} loading="lazy" />
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.toyotavn.android&amp;hl=vi" target="_blank" rel="noopener noreferrer" aria-label="Tải TOYOTA Vietnam trên Google Play">
          <img src="/media/footer/google-play-vi.png" alt="" width={135} height={52} loading="lazy" />
        </a>
      </nav>
    </div>
    <div className="home-footer-legal">
      <p>© {new Date().getFullYear()} {dealer}.</p>
      <p><a href="/chinh-sach-bao-mat-thong-tin/">Chính sách bảo mật</a><span aria-hidden="true"> · </span><a href="/thong-tin-xu-ly-du-lieu/">Thông tin xử lý dữ liệu</a></p>
      <p>{address}</p>
      <a className="home-footer-certification" href="https://online.gov.vn/nen-tang/afa0ccde-59ba-469f-aa91-d2f74f4f0f58" target="_blank" rel="noopener noreferrer">
        <img src="/media/footer/bo-cong-thuong.png" width={130} height={53} alt="Đã thông báo Bộ Công Thương" loading="lazy" />
      </a>
    </div>
    <a className="home-footer-wordmark" href="/" aria-label={dealer}>TOYOTA<span>THÁI HÒA TỪ LIÊM</span></a>
  </footer>
}
