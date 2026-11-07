import {notFound} from 'next/navigation'
import {cars} from '../../../../catalog'
import CorollaConfigurator from '../../../../components/CorollaConfigurator'
import {pageMetadata} from '../../../../site-metadata'
import {corollaConfigPath,corollaDetailPath,corollaTrims,vehicleColors} from '../../../../vehicle-options'

export const metadata = pageMetadata({
  title:'Cấu hình Toyota Corolla Cross',
  path:corollaConfigPath,
  description:'Chọn phiên bản và màu ngoại thất cho Toyota Corolla Cross, xem trước xe và gửi yêu cầu đến đại lý.',
})

export default async function Page({searchParams}:{searchParams:Promise<{trim?:string|string[]}>}) {
  const model = cars.find(car=>car.slug===corollaDetailPath)
  if (!model) notFound()
  const {trim} = await searchParams
  const initialTrim = corollaTrims.find(value=>value===trim) ?? corollaTrims[0]
  const colors = [...vehicleColors(model)].flatMap(([name,{photo}])=>photo ? [{name,photo}] : [])
  return <CorollaConfigurator model={model.title} initialTrim={initialTrim} colors={colors} />
}
