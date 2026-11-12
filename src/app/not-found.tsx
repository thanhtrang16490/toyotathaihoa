import SiteFrame from '../components/SiteFrame'
import {phone} from '../catalog'

export default function NotFound() {
  return <SiteFrame title="Không tìm thấy trang" path="/404/" noindex>
    <div className="wrap section">
      <h1>Không tìm thấy trang</h1>
      <div className="actions">
        <a className="btn" href="/xe-toyota-moi/">Xem các dòng xe Toyota</a>
        <a className="btn outline" href="/uu-dai/">Xem ưu đãi</a>
        <a className="btn outline" href={'tel:'+phone}>Gọi 0985 3333 88</a>
      </div>
      <p><a href="/">Về trang chủ</a></p>
    </div>
  </SiteFrame>
}
