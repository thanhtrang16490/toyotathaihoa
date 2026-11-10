import {phone} from '../catalog'
import {testDriveTimes} from '../test-drive'
import {getPublicCars} from '../site-content'

export default async function LeadForm({intent='quote',model='',fixedModel=false}:{intent?:string;model?:string;fixedModel?:boolean}) {
  const service = intent==='service'
  const cars = service || fixedModel ? [] : await getPublicCars()
  const testDrive = intent==='test_drive'
  const contact = <>
    <label>Họ và tên<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
    <label>Số điện thoại<input name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={24} /></label>
  </>
  const vehicle = <>
    {fixedModel ? <>
      <p className="test-drive-model"><span>Xe lái thử</span><strong>{model}</strong></p>
      <input type="hidden" name="model" value={model} />
    </> : <label>Dòng xe quan tâm<select name="model" defaultValue={model} required={testDrive}>
      <option value="">Chọn dòng xe</option>
      {cars.map(car=><option key={car.slug} value={car.title}>{car.title}</option>)}
    </select></label>}
    <p className="lead-selection" hidden></p>
    <input type="hidden" name="trim" />
    <input type="hidden" name="color" />
  </>

  return <form className="lead-form" action="/api/lead/" method="post" data-lead-form="">
    <input type="hidden" name="intent" value={intent} />
    {testDrive ? <>
      <section className="test-drive-group" aria-labelledby="drive-preferences">
        <h2 id="drive-preferences">Lịch lái thử của bạn</h2>
        <div className="test-drive-vehicle">{vehicle}</div>
        <label><span>Tính năng muốn trải nghiệm <span className="test-drive-optional">(không bắt buộc)</span></span>
          <textarea name="test_drive_note" rows={3} maxLength={200} />
        </label>
        <div className="test-drive-fields">
          <label>Ngày mong muốn<input name="preferred_date" type="date" /></label>
          <label>Giờ mong muốn<select name="preferred_time" defaultValue="">
            <option value="">Chọn giờ</option>
            {testDriveTimes.map(time=><option key={time} value={time}>{time}</option>)}
          </select></label>
        </div>
        <p className="test-drive-note">Bạn có thể để trống ngày và giờ. Đại lý sẽ gọi để xác nhận lịch lái thử.</p>
      </section>
      <section className="test-drive-group" aria-labelledby="drive-contact">
        <h2 id="drive-contact">Thông tin liên hệ</h2>
        <div className="test-drive-fields">
          {contact}
          <label><span>Email <span className="test-drive-optional">(không bắt buộc)</span></span>
            <input name="email" type="email" autoComplete="email" maxLength={120} />
          </label>
        </div>
      </section>
    </> : <>
      {contact}
      {!service && vehicle}
    </>}
    <label hidden>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="consent"><input name="consent" type="checkbox" value="yes" required /><span>Tôi đồng ý để đại lý dùng thông tin trên để liên hệ về yêu cầu này. <a href="/thong-tin-xu-ly-du-lieu/">Xem thông tin xử lý dữ liệu.</a></span></label>
    <button className="btn" type="submit">{testDrive ? 'Gửi đăng ký lái thử' : 'Gửi yêu cầu ↗'}</button>
    <p className="form-status" role="status" tabIndex={-1}></p>
    <a className="text-link" href={'tel:'+(service?'0981555588':phone)} data-event="hotline_click">{service?'Gọi dịch vụ · 0981 5555 88':'Gọi tư vấn · 0985 3333 88'}</a>
  </form>
}
