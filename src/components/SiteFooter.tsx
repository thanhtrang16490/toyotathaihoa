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
      </section>
    </div>
    <nav className="home-footer-contact" aria-label="Kết nối với đại lý">
      <a href="https://zalo.me/0985333388">Zalo ↗</a>
      <a href="mailto:cskh@toyotathaihoatuliem.com.vn">Email ↗</a>
      <a href={'tel:'+phone} data-event="hotline_click">Điện thoại ↗</a>
    </nav>
    <div className="home-footer-legal">
      <p>© {new Date().getFullYear()} {dealer}.</p>
      <p><a href="/chinh-sach-bao-mat-thong-tin/">Chính sách bảo mật</a><span aria-hidden="true"> · </span><a href="/thong-tin-xu-ly-du-lieu/">Thông tin xử lý dữ liệu</a></p>
      <p>{address}</p>
    </div>
    <a className="home-footer-wordmark" href="/" aria-label={dealer}>TOYOTA<span>THÁI HÒA TỪ LIÊM</span></a>
  </footer>
}
