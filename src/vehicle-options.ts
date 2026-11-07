import type {Entry} from './catalog'

export const corollaDetailPath = '/toyota/corolla-cross/'
export const corollaConfigPath = '/toyota/corolla-cross/cau-hinh/'
export const corollaTrims = ['1.8V', 'HEV'] as const

export const corollaTrimSpecs = {
  '1.8V': {id:'thong-so-18v',powertrain:'Động cơ xăng 1.8 L',transmission:'Tự động vô cấp (CVT)'},
  HEV: {id:'thong-so-hev',powertrain:'Động cơ xăng 1.8 L kết hợp mô-tơ điện',transmission:'Vô cấp điện tử (e-CVT)'},
} as const

export function vehicleColors(vehicle:Entry) {
  const colors = new Map<string, {photo:string; price:number}>()
  for (const variant of vehicle.variants ?? []) {
    const value = variant.options['attribute_mau-sac']?.trim()
    if (value) colors.set(/^\d+$/.test(value) ? 'Mã màu '+value : value, {photo:variant.image,price:variant.price})
  }
  return colors
}
