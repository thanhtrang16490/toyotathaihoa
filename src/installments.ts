export const maxLoanAmount = 20_000_000_000

export const sampleLoan = {
  introRate: 8,
  introMonths: 12,
  laterRate: 11,
  terms: [12, 24, 36, 48, 60, 72, 84, 96],
  defaultTerm: 60,
} as const

function amount(value: string, min: number) {
  if (!/^\d{1,11}$/.test(value)) return null
  const number = Number(value)
  return number >= min && number <= maxLoanAmount ? number : null
}

export function calculateInstallments(fields: {
  price: string
  costs: string
  down: string
  months: string
}) {
  const price = amount(fields.price, 1)
  const costs = amount(fields.costs || '0', 0)
  const down = amount(fields.down, 0)
  const months = sampleLoan.terms.find(term => String(term) === fields.months)

  if (price === null || costs === null || down === null || down >= price) {
    return {error: 'Nhập số tiền trả trước hợp lệ và nhỏ hơn giá xe. Chi phí trả ngay phải từ 0 đồng.'} as const
  }
  if (months === undefined) {
    return {error: 'Chọn một kỳ hạn trong phương án vay minh họa.'} as const
  }

  const loan = price - down
  const upfront = down + costs
  let balance = loan
  let totalInterest = 0
  const schedule = Array.from({length: months}, (_, index) => {
    const period = index + 1
    const annualRate = period <= sampleLoan.introMonths ? sampleLoan.introRate : sampleLoan.laterRate
    const principal = Math.floor(loan * period / months) - Math.floor(loan * index / months)
    const interest = Math.round(balance * annualRate / 1200)
    balance -= principal
    totalInterest += interest
    return {period, annualRate, principal, interest, payment: principal + interest, balance}
  })

  return {
    loan, upfront, totalInterest, schedule,
    totalRepayment: loan + totalInterest,
    totalCash: upfront + loan + totalInterest,
    peakPayment: Math.max(...schedule.map(row => row.payment)),
  } as const
}
