import Image from 'next/image'
import type {CSSProperties} from 'react'
import type {Entry} from '../catalog'
import {corollaDetailPath,corollaTrimSpecs,corollaTrims,vehicleTrims} from '../vehicle-options'
import {vehicleDetailData} from '../vehicle-detail-data'
import {gradeAnchor,vehicleGrades} from '../vehicle-grades'
import TechnicalDetails from './TechnicalDetails'
import VehicleGallery from './VehicleGallery'
import CorollaFeatureRail from './CorollaFeatureRail'
import styles from './corolla-cross.module.css'

const pavilion = '/media/generated/corolla-cross-detail-pavilion.webp'
const corollaSpecs = [
  ['Kiểu xe','SUV 5 chỗ'],
  ['Dung tích động cơ xăng','1.798 cc'],
  ['Kích thước (dài × rộng × cao)','4.460 × 1.825 × 1.620 mm'],
  ['Chiều dài cơ sở','2.640 mm'],
  ['Hộp số','Tự động vô cấp (1.8V) / Vô cấp điện tử (HEV)'],
] as const
const corollaHighlights = [
  {title:'Diện mạo Corolla Cross',photo:'/media/a27f19d3a6b9071b.webp',description:'Lưới tản nhiệt họa tiết tổ ong và cụm đèn trước thanh mảnh.',detail:'Đầu xe tạo điểm nhấn bằng mặt ca-lăng họa tiết tổ ong và cụm đèn LED. Thiết kế mặt trước có thể khác theo phiên bản.'},
  {title:'Khoang lái mở thoáng',photo:'/media/aaa46a9e3581c01e.webp',description:'Không gian 5 chỗ và bố cục điều khiển hướng về người lái.',detail:'Màn hình trung tâm đặt cao, với các nút điều khiển thiết yếu nằm trong tầm tay. Khoang lái có thể khác theo phiên bản.'},
  {title:'Cửa sổ trời toàn cảnh',photo:'/media/96fa59820acf185c.webp',description:'Ánh sáng tự nhiên cho khoang hành khách.',detail:'Cửa sổ trời toàn cảnh tạo cảm giác thoáng ở cả hai hàng ghế. Hãy xác nhận trang bị của phiên bản bạn quan tâm với đại lý.'},
  {title:'Không gian hành lý',photo:'/media/db86fdbaec163792.webp',description:'Khoang chứa đồ cho nhu cầu đi lại hằng ngày.',detail:'Hàng ghế sau có thể gập để tăng không gian cho những món đồ dài hoặc hành lý cồng kềnh.'},
]
const corollaDriving = [
  {title:'Chọn xăng hoặc Hybrid',photo:'/media/32c3212e7981b27e.webp',description:'Hai hệ truyền động cho những nhu cầu khác nhau.',detail:'Corolla Cross 1.8V dùng động cơ xăng 1.8 L. Bản HEV kết hợp động cơ xăng 1.8 L và mô-tơ điện.'},
  {title:'Cảnh báo tiền va chạm',photo:'/media/15249dfe24501d23.webp',description:'Hỗ trợ người lái nhận biết nguy cơ va chạm phía trước.',detail:'Hệ thống có thể cảnh báo và hỗ trợ phanh trong các điều kiện hoạt động phù hợp. Người lái vẫn cần quan sát và kiểm soát xe.'},
  {title:'Hỗ trợ theo dõi làn đường',photo:'/media/3767cdad5af746aa.webp',description:'Hỗ trợ duy trì hướng đi trong làn.',detail:'Hệ thống hỗ trợ theo dõi làn đường hoạt động khi nhận diện được vạch làn và đáp ứng các điều kiện vận hành.'},
]
const corollaGallery = ['/media/b5348f166e3ed75b.webp','/media/ce5c27bbe4094f30.webp','/media/9d2fff279d21b0f2.webp','/media/aaa46a9e3581c01e.webp','/media/2f459289783ee6ef.webp']

const corollaMetrics = [
  {label:'Dung tích động cơ xăng',value:'1.798',unit:'cc'},
  {label:'Chiều dài cơ sở',value:'2.640',unit:'mm'},
  {label:'Số chỗ ngồi',value:'5'},
]

const fjSpecs = [
  ['Động cơ', '2TR-FE (2,7 L)'],
  ['Dung tích xi-lanh', '2.694 cc'],
  ['Công suất cực đại', '164 hp tại 5.200 vòng/phút'],
  ['Mô-men xoắn cực đại', '245 Nm tại 4.000 vòng/phút'],
  ['Hộp số', 'Tự động 6 cấp'],
  ['Kích thước tổng thể', '4.610 × 1.855 × 1.950 mm'],
  ['Chiều dài cơ sở', '2.580 mm'],
  ['Số chỗ', '5'],
] as const

function RollingNumber({value}:{value:string}) {
  return <span className={styles.rollingNumber} data-rolling-number="">
    <span className={styles.rollingValue}>{value}</span>
    <span className={styles.rollingDigits} aria-hidden="true">
      {[...value].map((character,index)=>{
        if (!/^[0-9]$/.test(character)) return <span key={index}>{character}</span>
        const digit = Number(character)
        return <span className={styles.rollingWindow} key={index}>
          <span className={styles.rollingReel} style={{'--digit-offset':-100*digit/(digit+1)+'%'} as CSSProperties}>
            {Array.from({length:digit+1},(_,step)=><span key={step}>{step}</span>)}
          </span>
        </span>
      })}
    </span>
  </span>
}

export default function VehicleDetail({model,showPrice}:{model:Entry;showPrice:boolean}) {
  const isCorolla = model.slug===corollaDetailPath
  const isFj = model.slug==='/toyota/toyota-land-cruiser-fj/'
  const name = model.title.replace(/^Toyota /i,'')
  const wordmark = name.toUpperCase()
  const configPath = model.slug+'cau-hinh/'
  const trims = vehicleTrims(model.slug)
  const grades = vehicleGrades(model.slug)
  const profile = vehicleDetailData(model)
  const gallery = isCorolla ? corollaGallery : profile.gallery
  const metrics = isCorolla ? corollaMetrics : isFj ? [
    {label:'Động cơ',value:'2.7',unit:'L'},
    {label:'Công suất cực đại',value:'164',unit:'hp'},
    {label:'Mô-men xoắn cực đại',value:'245',unit:'Nm'},
  ] : profile.metrics
  const specs:readonly (readonly [string,string])[] = isCorolla ? corollaSpecs : isFj ? fjSpecs : [
    ['Kiểu xe',model.category],
    ...metrics.map(({label,value,unit})=>[label,unit ? value+' '+unit : value] as const),
  ]
  const highlights = isCorolla ? corollaHighlights : profile.features
  const driving = isCorolla ? corollaDriving : profile.driveCards
  const fuel = [...new Set(grades.map(({powertrain})=>powertrain.split(' ')[0]))].join(' / ')
  const designId = isFj ? 'thiet-ke-fj' : 'thiet-ke-xe'
  const drivingId = isFj ? 'van-hanh-fj' : 'van-hanh'
  return <div className={styles.detail} data-shared-vehicle={!isCorolla}>
    <section id="tong-quan" className="product-intro corolla-intro">
      <div className={styles.studio}>
        <span className={styles.wordmark} aria-hidden="true">{wordmark}</span>
        <Image src={isCorolla ? model.image : profile.studio} width={isCorolla ? 800 : 720} height={isCorolla ? 800 : 320} sizes="(max-width: 700px) 100vw, 1040px" className="product-cover" alt={model.title} loading="eager" fetchPriority="high" />
      </div>
      <div className={styles.introCopy}>
        <div className={styles.versionRail} aria-label={'Phiên bản '+name}>
          <span>{isCorolla ? 'SUV' : model.category}</span>
          {trims.map(trim=><a key={trim} href={configPath+'?'+new URLSearchParams({trim})}>{trim}</a>)}
        </div>
        <h1>{name}</h1>
        {fuel && <span className={styles.fuel}>{fuel}</span>}
        <p>{!isCorolla && showPrice && model.price || 'Liên hệ để xác nhận giá theo phiên bản'}</p>
        <div className="actions model-stage-actions">
          <a id="chon-mau-xe" className="btn" href="#chon-phien-ban" aria-haspopup="dialog">Chọn mẫu xe</a>
          <a className="btn outline" href={configPath}>Chọn cấu hình</a>
          <button className="btn outline" type="button" data-test-drive="vehicle-options" aria-haspopup="dialog" aria-controls="test-drive-drawer" data-event="cta_click">Đăng ký lái thử</button>
        </div>
      </div>
    </section>
    <nav className={styles.sectionNav} aria-label={'Khám phá '+name}>
      <a href="#tong-quan">{name}</a>
      <a href={'#'+designId}>Thiết kế</a>
      <a href={'#'+drivingId}>Vận hành</a>
      <a href="#hinh-anh-xe">Hình ảnh</a>
      <a href="#chi-tiet-xe">Thông số</a>
      {!isCorolla && grades.length>0 && <a href="#so-sanh-phien-ban">Phiên bản</a>}
    </nav>
    <section className={styles.specs} aria-label={isFj ? 'Thông số nổi bật Land Cruiser FJ' : 'Thông số nổi bật'}>
      <div>
        <dl>
          {metrics.map(({label,value,unit})=><div key={label}><dt>{label}</dt><dd><RollingNumber value={value} />{unit && <> <small>{unit}</small></>}</dd></div>)}
        </dl>
        <TechnicalDetails rows={specs} modelName={wordmark} />
      </div>
      <Image src={isCorolla ? "/media/32c3212e7981b27e.webp" : profile.photos[0] || profile.studio} width={900} height={isCorolla ? 365 : 560} alt={isCorolla ? "Corolla Cross màu trắng, góc nhìn trước và sau" : "Ngoại thất "+name} sizes="(max-width: 760px) 86vw, 52vw" />
    </section>
    <section id={designId} className={styles.story} aria-labelledby="corolla-story">
      <p className={styles.storyWordmark} aria-hidden="true">{wordmark}</p>
      <figure className={styles.storyMain}>
        <Image src={isCorolla ? pavilion : profile.story} width={1440} height={960} alt={isCorolla ? "Corolla Cross màu trắng bên công trình bê tông" : "Thiết kế "+name} sizes="(max-width: 760px) 86vw, 78vw" />
      </figure>
      <Image className={styles.storySide} src={isCorolla ? "/media/generated/corolla-cross-detail-rear.webp" : profile.photos[1] || profile.story} width={960} height={1200} alt={isCorolla ? "Ảnh minh họa Corolla Cross màu trắng nhìn từ phía sau" : "Chi tiết "+name} sizes="(max-width: 760px) 70vw, 40vw" />
      <div className={styles.storyCopy}>
        <h2 id="corolla-story">{name}.<br/>{isCorolla ? 'Một nhịp điệu riêng.' : profile.editorial?.headline}</h2>
        <p>{isCorolla ? 'Thiết kế SUV gọn gàng, tầm nhìn thoáng và khoang xe 5 chỗ phù hợp với nhịp sống đô thị cũng như những chuyến đi cuối tuần.' : profile.intro}</p>
      </div>
      <Image className={styles.storyBottom} src={isCorolla ? "/media/generated/corolla-cross-editorial-v2.webp" : profile.photos[2] || profile.studio} width={1254} height={1254} alt={isCorolla ? "Ảnh minh họa góc trước Corolla Cross màu trắng" : name} sizes="(max-width: 760px) 78vw, 42vw" />
    </section>
    <section className={styles.featureSection} aria-labelledby="corolla-highlights">
      <h2 id="corolla-highlights">Điểm nổi bật.</h2>
      <CorollaFeatureRail features={highlights} label="Điểm nổi bật" />
    </section>
    <section id={drivingId} className={styles.driving} aria-labelledby="corolla-driving">
      <div className={styles.drivingBanner}>
        <Image src={isCorolla ? "/media/ce5c27bbe4094f30.webp" : profile.photos[3] || profile.photos[0] || profile.story} alt="" fill sizes="100vw" />
      </div>
      <div className={styles.drivingCopy}>
        <h2 id="corolla-driving">Vận hành.</h2>
        <p>{isCorolla ? 'Khám phá hai lựa chọn động cơ và những công nghệ hỗ trợ người lái trên Corolla Cross.' : profile.editorial?.driveIntro}</p>
      </div>
      <CorollaFeatureRail features={driving} label="Tính năng vận hành" groups={isCorolla ? [{label:"Động cơ",start:0},{label:"Hỗ trợ lái",start:1}] : driving.map(({title},start)=>({label:title,start}))} />
    </section>
    <section id="hinh-anh-xe" className={styles.gallery}>
      <h2>{name} từ mọi góc nhìn.</h2>
      <VehicleGallery images={gallery} title={model.title} editorial />
    </section>
    <section id="chi-tiet-xe" className={styles.specTable}>
      <h2>Thông số kỹ thuật.</h2>
      <dl>{specs.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {isCorolla && <>
      <div className="actions">
        {corollaTrims.map(trim=><a className="btn outline" key={trim} href={'#'+corollaTrimSpecs[trim].id}>Thông số {trim}</a>)}
      </div>
      <div className={styles.trimSpecs}>
        {corollaTrims.map(trim=>{
          const {id,powertrain,transmission} = corollaTrimSpecs[trim]
          return <section key={trim} id={id} aria-labelledby={id+'-title'}>
            <h3 id={id+'-title'}>Corolla Cross {trim}</h3>
            <dl>
              <div><dt>Hệ truyền động</dt><dd>{powertrain}</dd></div>
              <div><dt>Hộp số</dt><dd>{transmission}</dd></div>
            </dl>
          </section>
        })}
      </div>
      </>}
    </section>
    {!isCorolla && grades.length>0 && <section id="so-sanh-phien-ban" className={styles.gradeSection} aria-labelledby="vehicle-grades">
      <h2 id="vehicle-grades">Khám phá các phiên bản.</h2>
      <p className={styles.gradeNote}>Hình ảnh đại diện cho dòng xe. Đại lý sẽ xác nhận trang bị và tình trạng xe theo phiên bản bạn chọn.</p>
      <div className={styles.gradeGrid}>
        {grades.map((grade,index)=><article className={styles.gradeCard} key={grade.name} id={gradeAnchor(index)}>
          <Image src={profile.studio} alt="" width={720} height={320} sizes="(max-width: 760px) 76vw, 360px" />
          <h3>{grade.name.startsWith(name) ? grade.name : name+' '+grade.name}</h3>
          <dl>
            <div><dt>Động cơ</dt><dd>{grade.powertrain}</dd></div>
            <div><dt>Hộp số</dt><dd>{grade.transmission}</dd></div>
            <div><dt>Số chỗ ngồi</dt><dd>{grade.seats}</dd></div>
            {grade.drive && <div><dt>Dẫn động</dt><dd>{grade.drive}</dd></div>}
          </dl>
          <a className="btn outline" href={configPath+'?'+new URLSearchParams({trim:grade.name})}>Cấu hình {grade.name}</a>
        </article>)}
      </div>
    </section>}
    <section className="vehicle-next">
      <p className="eyebrow">TOYOTA THÁI HÒA TỪ LIÊM</p>
      <h2>Trải nghiệm {name}.</h2>
      <p>Đặt lịch lái thử hoặc trao đổi với đại lý về phiên bản bạn quan tâm.</p>
      <div className="actions">
        <button className="btn" type="button" data-test-drive="vehicle-options" aria-haspopup="dialog" aria-controls="test-drive-drawer" data-event="cta_click">Đăng ký lái thử</button>
        <a className="btn outline" href="/contact/">Liên hệ đại lý ↗</a>
      </div>
    </section>
  </div>
}
