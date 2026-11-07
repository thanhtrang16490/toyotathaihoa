import Image from 'next/image'
import type {Entry} from '../catalog'
import {corollaConfigPath,corollaTrims} from '../vehicle-options'
import TechnicalDetails from './TechnicalDetails'
import VehicleGallery from './VehicleGallery'
import CorollaFeatureRail from './CorollaFeatureRail'
import styles from './corolla-cross.module.css'

const pavilion = '/media/generated/corolla-cross-detail-pavilion.webp'
const specs = [
  ['Kiểu xe','SUV 5 chỗ'],
  ['Dung tích động cơ xăng','1.798 cc'],
  ['Kích thước (dài × rộng × cao)','4.460 × 1.825 × 1.620 mm'],
  ['Chiều dài cơ sở','2.640 mm'],
  ['Hộp số','Tự động vô cấp (1.8V) / Vô cấp điện tử (HEV)'],
] as const
const highlights = [
  {title:'Diện mạo Corolla Cross',photo:'/media/a27f19d3a6b9071b.webp',description:'Lưới tản nhiệt họa tiết tổ ong và cụm đèn trước thanh mảnh.',detail:'Đầu xe tạo điểm nhấn bằng mặt ca-lăng họa tiết tổ ong và cụm đèn LED. Thiết kế mặt trước có thể khác theo phiên bản.'},
  {title:'Khoang lái mở thoáng',photo:'/media/aaa46a9e3581c01e.webp',description:'Không gian 5 chỗ và bố cục điều khiển hướng về người lái.',detail:'Màn hình trung tâm đặt cao, với các nút điều khiển thiết yếu nằm trong tầm tay. Khoang lái có thể khác theo phiên bản.'},
  {title:'Cửa sổ trời toàn cảnh',photo:'/media/96fa59820acf185c.webp',description:'Ánh sáng tự nhiên cho khoang hành khách.',detail:'Cửa sổ trời toàn cảnh tạo cảm giác thoáng ở cả hai hàng ghế. Hãy xác nhận trang bị của phiên bản bạn quan tâm với đại lý.'},
  {title:'Không gian hành lý',photo:'/media/db86fdbaec163792.webp',description:'Khoang chứa đồ cho nhu cầu đi lại hằng ngày.',detail:'Hàng ghế sau có thể gập để tăng không gian cho những món đồ dài hoặc hành lý cồng kềnh.'},
]
const driving = [
  {title:'Chọn xăng hoặc Hybrid',photo:'/media/32c3212e7981b27e.webp',description:'Hai hệ truyền động cho những nhu cầu khác nhau.',detail:'Corolla Cross 1.8V dùng động cơ xăng 1.8 L. Bản HEV kết hợp động cơ xăng 1.8 L và mô-tơ điện.'},
  {title:'Cảnh báo tiền va chạm',photo:'/media/15249dfe24501d23.webp',description:'Hỗ trợ người lái nhận biết nguy cơ va chạm phía trước.',detail:'Hệ thống có thể cảnh báo và hỗ trợ phanh trong các điều kiện hoạt động phù hợp. Người lái vẫn cần quan sát và kiểm soát xe.'},
  {title:'Hỗ trợ theo dõi làn đường',photo:'/media/3767cdad5af746aa.webp',description:'Hỗ trợ duy trì hướng đi trong làn.',detail:'Hệ thống hỗ trợ theo dõi làn đường hoạt động khi nhận diện được vạch làn và đáp ứng các điều kiện vận hành.'},
]
const gallery = ['/media/b5348f166e3ed75b.webp','/media/ce5c27bbe4094f30.webp','/media/9d2fff279d21b0f2.webp','/media/aaa46a9e3581c01e.webp','/media/2f459289783ee6ef.webp']

export default function CorollaCrossDetail({model}:{model:Entry}) {
  const testDrive = '/dang-ky-lai-thu/?'+new URLSearchParams({model:model.title})
  return <div className={styles.detail}>
    <section id="tong-quan" className="product-intro corolla-intro">
      <div className={styles.studio}>
        <span className={styles.wordmark} aria-hidden="true">COROLLA CROSS</span>
        <Image src={model.image} width={800} height={800} sizes="(max-width: 700px) 100vw, 1040px" className="product-cover" alt={model.title} loading="eager" fetchPriority="high" />
      </div>
      <div className={styles.introCopy}>
        <div className={styles.versionRail} aria-label="Phiên bản Corolla Cross">
          <span>SUV</span>
          {corollaTrims.map(trim=><a key={trim} href={corollaConfigPath+'?'+new URLSearchParams({trim})}>{trim}</a>)}
        </div>
        <h1>Corolla Cross</h1>
        <span className={styles.fuel}>Xăng / Hybrid</span>
        <p>Liên hệ để xác nhận giá theo phiên bản</p>
        <div className="actions model-stage-actions">
          <a id="chon-mau-xe" className="btn" href={corollaConfigPath}>Chọn mẫu xe</a>
          <a id="chon-phien-ban" className="btn outline" href={corollaConfigPath}>Chọn cấu hình</a>
          <a className="btn outline" href={testDrive} data-event="cta_click">Đăng ký lái thử</a>
        </div>
      </div>
    </section>
    <nav className={styles.sectionNav} aria-label="Khám phá Corolla Cross">
      <a href="#tong-quan">Corolla Cross</a>
      <a href="#thiet-ke-xe">Thiết kế</a>
      <a href="#van-hanh">Vận hành</a>
      <a href="#hinh-anh-xe">Hình ảnh</a>
      <a href="#chi-tiet-xe">Thông số</a>
    </nav>
    <section className={styles.specs} aria-label="Thông số nổi bật">
      <div>
        <dl>
          <div><dt>Dung tích động cơ xăng</dt><dd>1.798 <small>cc</small></dd></div>
          <div><dt>Chiều dài cơ sở</dt><dd>2.640 <small>mm</small></dd></div>
          <div><dt>Số chỗ ngồi</dt><dd>5</dd></div>
        </dl>
        <TechnicalDetails rows={specs} modelName="COROLLA CROSS" />
      </div>
      <Image src="/media/32c3212e7981b27e.webp" width={900} height={365} alt="Corolla Cross màu trắng, góc nhìn trước và sau" sizes="(max-width: 760px) 86vw, 52vw" />
    </section>
    <section id="thiet-ke-xe" className={styles.story} aria-labelledby="corolla-story">
      <p className={styles.storyWordmark} aria-hidden="true">COROLLA CROSS</p>
      <figure className={styles.storyMain}>
        <Image src={pavilion} width={1440} height={960} alt="Corolla Cross màu trắng bên công trình bê tông" sizes="(max-width: 760px) 86vw, 78vw" />
      </figure>
      <Image className={styles.storySide} src="/media/generated/corolla-cross-detail-rear.webp" width={960} height={1200} alt="Ảnh minh họa Corolla Cross màu trắng nhìn từ phía sau" sizes="(max-width: 760px) 70vw, 40vw" />
      <div className={styles.storyCopy}>
        <h2 id="corolla-story">Corolla Cross.<br/>Một nhịp điệu riêng.</h2>
        <p>Thiết kế SUV gọn gàng, tầm nhìn thoáng và khoang xe 5 chỗ phù hợp với nhịp sống đô thị cũng như những chuyến đi cuối tuần.</p>
      </div>
      <Image className={styles.storyBottom} src="/media/generated/corolla-cross-editorial-v2.webp" width={1254} height={1254} alt="Ảnh minh họa góc trước Corolla Cross màu trắng" sizes="(max-width: 760px) 78vw, 42vw" />
    </section>
    <section className={styles.featureSection} aria-labelledby="corolla-highlights">
      <h2 id="corolla-highlights">Điểm nổi bật.</h2>
      <CorollaFeatureRail features={highlights} label="Điểm nổi bật" />
    </section>
    <section id="van-hanh" className={styles.driving} aria-labelledby="corolla-driving">
      <div className={styles.drivingBanner}>
        <Image src="/media/ce5c27bbe4094f30.webp" alt="" fill sizes="100vw" />
      </div>
      <div className={styles.drivingCopy}>
        <h2 id="corolla-driving">Vận hành.</h2>
        <p>Khám phá hai lựa chọn động cơ và những công nghệ hỗ trợ người lái trên Corolla Cross.</p>
      </div>
      <CorollaFeatureRail features={driving} label="Tính năng vận hành" />
    </section>
    <section id="hinh-anh-xe" className={styles.gallery}>
      <h2>Corolla Cross từ mọi góc nhìn.</h2>
      <VehicleGallery images={gallery} title={model.title} editorial />
    </section>
    <section id="chi-tiet-xe" className={styles.specTable}>
      <h2>Thông số kỹ thuật.</h2>
      <dl>{specs.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <p>Đối chiếu thông số và trang bị theo phiên bản tại Toyota Việt Nam.</p>
      <div className="actions">
        <a className="btn outline" href="https://www.toyota.com.vn/corolla-cross-1-8v">Thông số 1.8V ↗</a>
        <a className="btn outline" href="https://www.toyota.com.vn/corolla-cross-1-8hev">Thông số HEV ↗</a>
      </div>
    </section>
    <section className="vehicle-next">
      <p className="eyebrow">TOYOTA THÁI HÒA TỪ LIÊM</p>
      <h2>Trải nghiệm Corolla Cross.</h2>
      <p>Đặt lịch lái thử hoặc trao đổi với đại lý về phiên bản bạn quan tâm.</p>
      <div className="actions">
        <a className="btn" href={testDrive} data-event="cta_click">Đăng ký lái thử</a>
        <a className="btn outline" href="/contact/">Liên hệ đại lý ↗</a>
      </div>
    </section>
  </div>
}
