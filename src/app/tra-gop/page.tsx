import {redirect} from 'next/navigation'
import {onRoadPath} from '../../on-road-prices'

export default async function InstallmentsRedirect({searchParams}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const params = new URLSearchParams()
  for (const key of ['xe', 'khuVuc', 'gia', 'chiPhi', 'traTruoc', 'kyHan', 'tinh']) {
    const value = query[key]
    if (typeof value === 'string') params.set(key, value)
  }
  if (!params.has('xe') && params.has('gia')) params.set('xe', '')
  params.set('phuongThuc', 'tra-gop')
  redirect(onRoadPath + '?' + params + (params.get('tinh') === '1' ? '#ket-qua' : '#tra-gop'))
}
