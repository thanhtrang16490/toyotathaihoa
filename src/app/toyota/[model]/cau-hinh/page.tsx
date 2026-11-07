import {notFound} from 'next/navigation'
import {cars} from '../../../../catalog'
import VehicleConfigurator from '../../../../components/VehicleConfigurator'
import BrowserInteractions from '../../../../components/BrowserInteractions'
import TestDriveDrawer from '../../../../components/TestDriveDrawer'
import {pageMetadata} from '../../../../site-metadata'
import {vehicleDetailData} from '../../../../vehicle-detail-data'
import {corollaDetailPath,vehicleColors,vehicleTrims} from '../../../../vehicle-options'

type RouteProps = {params:Promise<{model:string}>;searchParams:Promise<{trim?:string|string[];color?:string|string[]}>}

async function findModel(params:RouteProps['params']) {
  const {model:slug} = await params
  const model = cars.find(car=>car.slug==='/toyota/'+slug+'/')
  if (!model) notFound()
  return model
}

export async function generateMetadata({params}:RouteProps) {
  const model = await findModel(params)
  return pageMetadata({
    title:'Cấu hình '+model.title,
    path:model.slug+'cau-hinh/',
    description:`Xem trước ${model.title}, chọn cấu hình và gửi yêu cầu đến đại lý.`,
  })
}

export default async function Page({params,searchParams}:RouteProps) {
  const model = await findModel(params)
  const {trim,color} = await searchParams
  const trims = vehicleTrims(model.slug)
  const requestedTrim = model.slug==='/toyota/innova-cross/' ? (trim==='Xăng' ? '2.0V' : trim==='HEV' ? '2.0HEV' : trim) : trim
  const initialTrim = trims.find(value=>value===requestedTrim) ?? trims[0] ?? ''
  const colors = [...vehicleColors(model)].flatMap(([name,{photo}])=>photo ? [{name,photo}] : [])
  const initialColor = colors.find(option=>option.name===color)?.name ?? ''
  const {studio,story,photos} = vehicleDetailData(model)
  const scenes = model.slug===corollaDetailPath ? undefined : [
    {name:'Ngoại thất',src:story},
    {name:'Ảnh studio',src:studio,studio:true},
    ...photos.filter(photo=>photo!==story).slice(0,2).map((src,index)=>({name:'Chi tiết '+(index+1),src})),
  ]
  return <>
    <VehicleConfigurator model={model.title} detailPath={model.slug} trims={trims} initialTrim={initialTrim} initialColor={initialColor} colors={colors} scenes={scenes} />
    <TestDriveDrawer model={model.title} />
    <BrowserInteractions path={model.slug+'cau-hinh/'} />
  </>
}
