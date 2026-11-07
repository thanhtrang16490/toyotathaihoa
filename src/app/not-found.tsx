import SiteFrame from '../components/SiteFrame'
export default function NotFound(){
  return <SiteFrame title="Không tìm thấy trang" path="/404/" noindex><div className="wrap section"><h1>Không tìm thấy trang</h1><a className="btn" href="/">Về trang chủ ↗</a></div></SiteFrame>
}
