'use client'

import {useState} from 'react'
import {calculateInstallments} from '../../installments'
import {onRoadEstimate, registrationAreas, type OnRoadPrice} from '../../on-road-prices'
import {LoanFields, LoanSchedule, LoanSummary, ManualCostsField, ManualPriceField, type LoanInputs} from './InstallmentEstimate'
import layoutStyles from './prices.module.css'
import styles from './installments.module.css'

const currency = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'})
const percentage = new Intl.NumberFormat('vi-VN', {style: 'percent', maximumFractionDigits: 1})

export default function PriceEstimate({rows, vehicle, region, installments, initialInputs}: {
  rows: OnRoadPrice[]
  vehicle: string
  region: string
  installments: boolean
  initialInputs: LoanInputs
}) {
  const [showLoanFields, setShowLoanFields] = useState(installments)
  const [selectedVehicle, setSelectedVehicle] = useState(vehicle)
  const [selectedRegion, setSelectedRegion] = useState(region)
  const [inputs, setInputs] = useState(initialInputs)
  const updateInput = (field: keyof LoanInputs, value: string) =>
    setInputs(previous => ({...previous, [field]: value}))

  const selected = rows.find(row => row.id === selectedVehicle)
  const area = registrationAreas.find(item => item.id === selectedRegion) ?? registrationAreas[0]
  const price = selected && onRoadEstimate(selected, area.id)
  const catalogCosts = price?.total == null ? null : price.total - price.retail
  const needsCosts = catalogCosts === null
  const resolvedCosts = needsCosts ? inputs.costs : String(catalogCosts)
  const vehiclePrice = price ? String(price.retail) : inputs.price
  const result = showLoanFields && inputs.down && vehiclePrice
    ? calculateInstallments({...inputs, price: vehiclePrice, costs: resolvedCosts})
    : null
  const loan = result && !('error' in result) ? result : null

  const groups = new Map<string, OnRoadPrice[]>()
  for (const row of rows) {
    const group = groups.get(row.model)
    if (group) group.push(row)
    else groups.set(row.model, [row])
  }

  return <>
    <div className={layoutStyles.grid}>
      <section className={layoutStyles.panel} aria-labelledby="estimate-options">
        <h2 id="estimate-options">Chọn xe và nơi đăng ký</h2>
        <label htmlFor="price-car">Dòng xe và phiên bản</label>
        <select id="price-car" name="xe" value={selectedVehicle} onChange={event => setSelectedVehicle(event.target.value)}>
          <option value="">Tự nhập giá khi trả góp</option>
          {[...groups].map(([model, variants]) => <optgroup key={model} label={model}>
            {variants.map(({id, variant}) => <option key={id} value={id}>{model} · {variant}</option>)}
          </optgroup>)}
        </select>
        <label htmlFor="price-region">Khu vực đăng ký</label>
        <select id="price-region" name="khuVuc" value={selectedRegion} onChange={event => setSelectedRegion(event.target.value)}>
          {registrationAreas.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <p className={layoutStyles.hint}>Các nhóm khu vực lấy theo bảng gốc. Công thức Hilux dùng mức riêng 6% hoặc 7,2% tùy nhóm.</p>
        <fieldset id="tra-gop" className={styles.payment}>
          <legend>Hình thức thanh toán</legend>
          <label>
            <input type="radio" name="phuongThuc" value="tra-thang" checked={!showLoanFields} onChange={() => setShowLoanFields(false)} />
            Trả thẳng
          </label>
          <label>
            <input type="radio" name="phuongThuc" value="tra-gop" checked={showLoanFields} onChange={() => setShowLoanFields(true)} />
            Trả góp
          </label>
        </fieldset>
        {showLoanFields && <fieldset className={styles.loanFields}>
          <legend>Thông tin khoản vay</legend>
          {needsCosts ? <div className={styles.fields}>
            {!price && <ManualPriceField value={inputs.price} onChange={value => updateInput('price', value)} />}
            <ManualCostsField value={inputs.costs} onChange={value => updateInput('costs', value)} />
          </div> : <p className={layoutStyles.hint}>Giá xe và chi phí lăn bánh được lấy theo phiên bản và khu vực đã chọn.</p>}
          <LoanFields inputs={inputs} onChange={updateInput} />
        </fieldset>}
      </section>

      <section id="du-toan" className={layoutStyles.result} aria-labelledby="price-result-title">
        <p className={layoutStyles.area}>{area.label} · {showLoanFields ? 'Trả góp' : 'Trả thẳng'}</p>
        <h2 id="price-result-title">{price ? price.model + ' · ' + price.variant : 'Dự toán chi phí mua xe'}</h2>
        {price && <>
          <p className={layoutStyles.totalLabel}>Tổng chi phí lăn bánh tham khảo</p>
          <p className={layoutStyles.total} aria-live="polite">{price.total === null ? 'Đang đối chiếu' : currency.format(price.total)}</p>
          <dl className={layoutStyles.breakdown}>
            <div><dt>Giá niêm yết trong bảng</dt><dd>{currency.format(price.retail)}</dd></div>
            <div><dt>Lệ phí trước bạ ({percentage.format(price.rate / 100)})</dt><dd>{currency.format(price.registrationFee)}</dd></div>
            {price.otherFees !== null && <div><dt>Các khoản phí còn lại trong bảng</dt><dd>{currency.format(price.otherFees)}</dd></div>}
          </dl>
          {price.total === null && <p>Tổng chi phí tại khu vực này đang được đối chiếu với đại lý.</p>}
          {price.note && <p>{price.note}</p>}
        </>}
        {!price && !showLoanFields && <p>Chọn phiên bản xe để xem chi phí trả thẳng.</p>}
        {showLoanFields && <div id="ket-qua">
          {result && 'error' in result && <p aria-live="polite">{result.error}</p>}
          {!result && <p>{vehiclePrice ? 'Nhập tiền trả trước và chọn kỳ hạn để tính lịch trả góp.' : 'Nhập giá xe để tính lịch trả góp.'}</p>}
          {loan && <LoanSummary loan={loan} inputs={inputs} resolvedCosts={resolvedCosts} />}
        </div>}
        <a href="/nhan-bao-gia/" data-event="cta_click">Nhận báo giá hiện hành ↗</a>
      </section>
    </div>
    {loan && <LoanSchedule loan={loan} />}
  </>
}
