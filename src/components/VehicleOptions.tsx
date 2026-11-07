
import type {Entry} from '../catalog'
export default function VehicleOptions({vehicle,showColorPrices=false,previewSrc}:{vehicle:Entry;showColorPrices?:boolean;previewSrc?:string}){
const trims: Record<string, string[]> = {
  'avanza-premio': ['1.5L MT', '1.5L CVT'],
  camry: ['2.0Q', 'HEV Premium', 'HEV Luxury'],
  'corolla-cross': ['1.8V', 'HEV'],
  fortuner: ['2.7 AT 4×2', 'Legender 2.4 AT 4×2', 'Legender 2.7 AT 4×4', 'Legender 2.8 AT 4×4'],
  hilux: ['Standard 4×2 MT', 'Pro 4×2 AT', 'Trailhunter 4×4'],
  'innova-cross': ['Xăng', 'HEV'],
  'veloz-cross': ['CVT', 'CVT TOP'],
  vios: ['1.5E MT', '1.5E CVT', '1.5G CVT'],
  wigo: ['G'],
  'yaris-cross': ['Xăng', 'Hybrid'],
}
const versions = trims[vehicle.slug.split('/')[2]] ?? []
const colors = new Map<string, {photo:string; price:number}>()
for (const variant of vehicle.variants ?? []) {
  const value = variant.options['attribute_mau-sac']?.trim()
  if (value) colors.set(/^\d+$/.test(value) ? 'Mã màu '+value : value, {photo:variant.image, price:variant.price})
}
return (<form id="vehicle-options" className="vehicle-options" action="/nhan-bao-gia/" method="get" data-vehicle-options="">
  <input type="hidden" name="model" value={vehicle.title} />
  {versions.length > 0 && <fieldset className="variant-trim-picker">
    <legend>Phiên bản quan tâm</legend>
    <div className="option-list">
      <label><input type="radio" name="trim" value="" defaultChecked /><span>Chưa chọn</span></label>
      {versions.map(version => <label key={version}><input type="radio" name="trim" value={version} /><span>{version}</span></label>)}
    </div>
  </fieldset>}
  <div className="vehicle-variant-card">
    {previewSrc && <img className="option-preview" src={previewSrc} loading="lazy" width="480" height="240" alt={vehicle.title} />}
    <div className="vehicle-variant-card-title">
      <h3>{vehicle.title}</h3>
      {vehicle.category && <span>{vehicle.category}</span>}
    </div>
    {colors.size > 0 && <fieldset>
      <legend>Màu xe quan tâm</legend>
      <div className="option-list option-colors">
        <label><input type="radio" name="color" value="" defaultChecked /><span>Chưa chọn</span></label>
        {[...colors].map(([label, {photo, price}]) => <label key={label}>
          <input type="radio" name="color" value={label} aria-label={label} data-photo={photo} />
          <span>{photo && <img src={photo} width="76" height="48" alt="" loading="lazy" />}{label}{showColorPrices && price > 0 && <small>{new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(price)}</small>}</span>
        </label>)}
      </div>
    </fieldset>}
    {colors.size > 0 && <p className="muted">Ảnh theo màu tham khảo. Đại lý sẽ xác nhận màu có sẵn cho phiên bản bạn chọn.</p>}
    <div className="actions">
      <button className="btn" type="submit" formMethod="dialog">Xong</button>
      <button className="btn outline" type="submit" data-event="cta_click">Nhận báo giá</button>
    </div>
  </div>
</form>)
}
