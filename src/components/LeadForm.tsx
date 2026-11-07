
import {cars,phone} from '../catalog'
export default function LeadForm({intent='quote',model=''}:{intent?:string,model?:string}){
const service = intent==='service'
return (<form className="lead-form" action="/api/lead/" method="post" data-lead-form="">
  <input type="hidden" name="intent" value={intent} />
  <label>Họ và tên<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
  <label>Số điện thoại<input name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={24} /></label>
  {!service && <label>Dòng xe quan tâm<select name="model" defaultValue={model}><option value="">Chọn dòng xe</option>{cars.map(car=><option key={car.slug} value={car.title}>{car.title}</option>)}</select></label>}
  {!service && <p className="lead-selection" hidden></p>}
  {!service && <><input type="hidden" name="trim" /><input type="hidden" name="color" /></>}
  <label hidden>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
  <label className="consent"><input name="consent" type="checkbox" value="yes" required /><span>Tôi đồng ý để đại lý dùng thông tin trên để liên hệ về yêu cầu này. <a href="/thong-tin-xu-ly-du-lieu/">Xem thông tin xử lý dữ liệu.</a></span></label>
  <button className="btn" type="submit">Gửi yêu cầu ↗</button>
  <p className="form-status" role="status" tabIndex={-1}></p>
  <a className="text-link" href={'tel:'+(service?'0981555588':phone)} data-event="hotline_click">{service?'Gọi dịch vụ · 0981 5555 88':'Gọi tư vấn · 0985 3333 88'}</a>
</form>)
}
