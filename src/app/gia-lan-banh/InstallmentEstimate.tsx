import {calculateInstallments, maxLoanAmount, sampleLoan} from '../../installments'
import layoutStyles from './prices.module.css'
import styles from './installments.module.css'

const money = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'})
const percent = new Intl.NumberFormat('vi-VN', {style: 'percent', maximumFractionDigits: 2})

export type LoanInputs = Parameters<typeof calculateInstallments>[0]
export type LoanResult = Exclude<ReturnType<typeof calculateInstallments>, {error: string}>

export function readLoanInputs(query: Record<string, string | string[] | undefined>): LoanInputs {
  const value = (key: string) => typeof query[key] === 'string' ? query[key].slice(0, 32).trim() : ''
  const term = sampleLoan.terms.find(months => String(months) === value('kyHan'))
  return {
    price: value('gia'), costs: value('chiPhi'), down: value('traTruoc'),
    months: String(term ?? sampleLoan.defaultTerm),
  }
}

export function ManualPriceField({value, onChange}: {value: string; onChange: (value: string) => void}) {
  return <label>Giá xe tự nhập (đồng)
    <input name="gia" type="number" inputMode="numeric" min="1" max={maxLoanAmount} step="1" required value={value} onChange={event => onChange(event.target.value)} />
  </label>
}

export function ManualCostsField({value, onChange}: {value: string; onChange: (value: string) => void}) {
  return <label>Chi phí trả ngay tự nhập (đồng)
    <input name="chiPhi" type="number" inputMode="numeric" min="0" max={maxLoanAmount} step="1" value={value} onChange={event => onChange(event.target.value)} />
    <small>Nhập chi phí lăn bánh dự kiến ngoài giá xe.</small>
  </label>
}

export function LoanFields({inputs, onChange}: {
  inputs: LoanInputs
  onChange: (field: 'down' | 'months', value: string) => void
}) {
  return <>
    <div className={styles.fields}>
      <label>Tiền trả trước (đồng)
        <input name="traTruoc" type="number" inputMode="numeric" min="0" max={maxLoanAmount} step="1" required value={inputs.down} onChange={event => onChange('down', event.target.value)} />
      </label>
      <label>Thời hạn vay
        <select name="kyHan" value={inputs.months} onChange={event => onChange('months', event.target.value)} required>
          {sampleLoan.terms.map(term => <option key={term} value={term}>{term} tháng</option>)}
        </select>
      </label>
    </div>
    <p className={layoutStyles.hint}>
      Phương án vay minh họa dùng {sampleLoan.introRate}%/năm trong {sampleLoan.introMonths} tháng đầu
      và {sampleLoan.laterRate}%/năm từ tháng {sampleLoan.introMonths + 1}. Lãi suất thực tế do bên cho vay xác nhận.
    </p>
  </>
}

export function LoanSummary({loan, inputs, resolvedCosts}: {
  loan: LoanResult
  inputs: LoanInputs
  resolvedCosts: string
}) {
  return <>
    <p>Tiền cần chuẩn bị lúc mua</p>
    <p className={styles.highlight} aria-live="polite">{money.format(loan.upfront)}</p>
    <dl className={layoutStyles.breakdown}>
      <div><dt>Giá xe dùng để tính</dt><dd>{money.format(loan.loan + Number(inputs.down))}</dd></div>
      <div><dt>Trả trước cho xe</dt><dd>{money.format(Number(inputs.down))}</dd></div>
      <div><dt>Chi phí trả ngay đã tính</dt><dd>{resolvedCosts ? money.format(Number(resolvedCosts)) : 'Chưa nhập'}</dd></div>
      <div><dt>Số tiền vay</dt><dd>{money.format(loan.loan)}</dd></div>
      <div><dt>Trả góp kỳ đầu</dt><dd>{money.format(loan.schedule[0].payment)}</dd></div>
      <div><dt>Kỳ trả góp cao nhất</dt><dd>{money.format(loan.peakPayment)}</dd></div>
      <div><dt>Tổng tiền lãi</dt><dd>{money.format(loan.totalInterest)}</dd></div>
      <div><dt>Tổng gốc và lãi</dt><dd>{money.format(loan.totalRepayment)}</dd></div>
      <div><dt>Tổng tiền chi dự kiến</dt><dd>{money.format(loan.totalCash)}</dd></div>
    </dl>
    {!resolvedCosts && <p>Khoản cần chuẩn bị và tổng tiền chi hiện chưa gồm chi phí trả ngay ngoài tiền trả trước.</p>}
    <p>Gốc chia đều. Tiền lãi mỗi tháng tính trên dư nợ đầu kỳ theo lãi suất năm chia 12.</p>
  </>
}

export function LoanSchedule({loan}: {loan: LoanResult}) {
  return <section className={styles.schedule} aria-labelledby="schedule-title">
    <h2 id="schedule-title">Lịch trả nợ theo tháng</h2>
    <div className={styles.tableScroll} role="region" aria-label="Bảng lịch trả nợ, cuộn ngang để xem thêm" tabIndex={0}>
      <table>
        <thead><tr>
          <th scope="col">Kỳ</th>
          <th scope="col">Lãi suất năm</th><th scope="col">Gốc</th><th scope="col">Lãi</th>
          <th scope="col">Tổng trả</th><th scope="col">Dư nợ còn lại</th>
        </tr></thead>
        <tbody>{loan.schedule.map(row => <tr key={row.period}>
          <th scope="row">{row.period}</th>
          <td>{percent.format(row.annualRate / 100)}</td><td>{money.format(row.principal)}</td>
          <td>{money.format(row.interest)}</td><td>{money.format(row.payment)}</td><td>{money.format(row.balance)}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </section>
}
