import type {Entry} from './catalog'
import {vehicleEditorial} from './vehicle-editorial'
import {vehicleDetailImagery,vehicleMenuImagery} from './vehicle-imagery'

type Profile = {
  seats:number|string
  wheelbase:string
  displacement?:string
  photos:string[]
  intro:string
  details:readonly [photoIndex:number,title:string,detail:string][]
}

const profiles:Record<string,Profile> = {
  'toyota-land-cruiser-fj': {
    seats:5,wheelbase:'2.580',displacement:'2.694',
    photos:['36c91af4c0c9e3ee.webp','62f522f143914703.webp','8a2b4107700ed040.webp','d8bec76498456aed.webp','7e8373cf75856cd6.webp'],
    intro:"Thân xe vuông vức, đèn trước tròn và vòm bánh rõ nét gợi nhớ các thế hệ Land Cruiser trước.",
    details:[
      [0, "Dáng vuông", "Các đường nét thẳng chạy dọc thân xe, từ nắp ca-pô đến phần đuôi."],
      [3, "Khoang hành lý", "Cửa sau mở ngang để tiếp cận khoang hành lý."],
    ],
  },
  'yaris-cross': {
    seats:5,wheelbase:'2.620',displacement:'1.496',
    photos:['61c0db0bbac014e3.webp','2e24cd00d457b8b7.webp','7ab5f8cc81f2a8ab.webp','fbffa1d2a2eab5f9.webp'],
    intro:"Dáng SUV gọn với vòm bánh nổi bật. Yaris Cross có lựa chọn động cơ xăng và Hybrid.",
    details:[
      [0, "Thiết kế đầu xe", "Hốc đèn và cản trước tạo điểm nhấn cho phần đầu xe."],
      [3, "Dáng xe nhìn ngang", "Đường gân dọc thân và ốp vòm bánh làm rõ dáng SUV."],
    ],
  },
  vios: {
    seats:5,wheelbase:'2.550',displacement:'1.496',
    photos:['4a133170e229f422.webp','429a0333fa99143d.webp','62e23a772008d0b1.webp','d3cac52a158be916.webp'],
    intro:"Vios giữ kiểu thân sedan 5 chỗ với cốp tách riêng. Các phiên bản trong danh mục có lựa chọn số sàn hoặc tự động vô cấp.",
    details:[
      [1, "Mặt trước Vios", "Lưới tản nhiệt mở rộng xuống cản trước."],
      [2, "Thân xe sedan", "Quan sát dáng mui và phần cốp riêng từ góc nhìn chéo."],
    ],
  },
  'innova-cross': {
    seats:'7–8',wheelbase:'2.850',displacement:'1.987',
    photos:['ea6d435153c6c78d.webp','371770ec9022aa7b.webp','fd2b04205a6b56b4.webp','df3479045977bebd.webp'],
    intro:"Innova Cross có ba hàng ghế, phù hợp cho những chuyến đi cùng gia đình.",
    details:[
      [0, "Dáng MPV", "Thân xe kéo dài qua hàng ghế thứ ba."],
      [2, "Ngoại thất nhìn ngang", "Góc nhìn ngang cho thấy chiều dài của khoang hành khách."],
    ],
  },
  hilux: {
    seats:5,wheelbase:'3.085',displacement:'2.755',
    photos:['480a7f322e4a3b75.webp','05a816cb7d0f0af6.webp','3feafdb322e0088a.webp','a095e71bf2cacf94.webp'],
    intro:"Cabin hai hàng ghế và thùng hàng riêng tạo nên dáng bán tải của Hilux.",
    details:[
      [1, "Góc trước Hilux", "Cụm đèn đặt cao trên mặt trước, phía trên cản xe."],
      [3, "Cabin và thùng hàng", "Góc nhìn chéo cho thấy cách cabin và thùng hàng được bố trí."],
    ],
  },
  camry: {
    seats:5,wheelbase:'2.825',
    photos:['4fc9d4aef7aa3d7a.webp','d592e4cf05c286e4.webp','c5f709f1740226a7.webp','dc259283270ff0e4.webp'],
    intro:"Camry có kiểu thân sedan 5 chỗ. Danh mục có phiên bản động cơ xăng và Hybrid.",
    details:[
      [0, "Dáng sedan Camry", "Mui xe thấp dần về phía khoang hành lý."],
      [2, "Khoang hành khách", "Quan sát bố trí hàng ghế và bề mặt hoàn thiện trong khoang xe."],
    ],
  },
  fortuner: {
    seats:7,wheelbase:'2.745',
    photos:['0657c7ace5eab5e3.webp','7162aa0bb50a5054.webp','58a4dd0e2469907f.webp','6e66c5b6b701e240.webp'],
    intro:"Fortuner có dáng SUV 7 chỗ. Các phiên bản trong danh mục có lựa chọn động cơ xăng hoặc diesel.",
    details:[
      [1, "Thân xe SUV", "Thân xe cao, phần mui kéo dài đến khu vực hàng ghế thứ ba."],
      [2, "Góc nhìn ngang", "Góc nhìn ngang làm rõ tỷ lệ thân xe và kích thước vòm bánh."],
    ],
  },
  raize: {
    seats:5,wheelbase:'2.525',displacement:'998',
    photos:['ee2988f58e281847.webp','b507cb481cad7543.webp','c32c7abb00709ee4.webp'],
    intro:"Raize kết hợp thân xe SUV gọn với động cơ xăng tăng áp dung tích 998 cc.",
    details:[
      [1, "Dáng xe nhỏ gọn", "Quan sát đường mui và dáng đuôi xe từ góc ngang."],
      [0, "Mặt trước Raize", "Cụm đèn trước nằm hai bên lưới tản nhiệt."],
    ],
  },
  wigo: {
    seats:5,wheelbase:'2.525',displacement:'1.198',
    photos:['d5dab4fc2cc15fe4.webp','6fb926f54dec0505.webp','e6b2df98db58e81e.webp','a5aeb2f05194c53f.webp'],
    intro:"Wigo là mẫu hatchback 5 chỗ, với cửa hậu mở lên để tiếp cận khoang hành lý.",
    details:[
      [0, "Mặt trước Wigo", "Lưới tản nhiệt lớn tạo điểm nhấn trên phần đầu xe."],
      [3, "Dáng hatchback", "Góc nhìn từ phía sau cho thấy cửa hậu và cụm đèn đuôi."],
    ],
  },
  'veloz-cross': {
    seats:7,wheelbase:'2.750',displacement:'1.496',
    photos:['5e2ad5d163144130.webp','ee145a8312c3e333.webp','b5f65ca8ecd3f514.webp','d62c1eadc37ac0f1.webp'],
    intro:"Veloz Cross có ba hàng ghế, với hai phiên bản CVT và CVT TOP trong danh mục.",
    details:[
      [0, "Dáng MPV Veloz Cross", "Mui kéo dài về phía sau, bao quanh không gian ba hàng ghế."],
      [2, "Góc nhìn phía sau", "Quan sát dáng cửa hậu và cụm đèn đuôi."],
    ],
  },
  'avanza-premio': {
    seats:7,wheelbase:'2.750',displacement:'1.496',
    photos:['38b91a9a4ea695fd.webp','98a5b3ecc4542611.webp','dba9825d13434fe4.webp','c3a676470feb04db.webp'],
    intro:"Avanza Premio có 7 chỗ ngồi và lựa chọn hộp số sàn hoặc tự động vô cấp.",
    details:[
      [0, "Mặt trước Avanza Premio", "Các thanh ngang trên lưới tản nhiệt tạo điểm nhấn cho đầu xe."],
      [2, "Thân xe 7 chỗ", "Đường mui kéo dài về phía hàng ghế sau."],
    ],
  },
  'toyota-land-prado': {
    seats:7,wheelbase:'2.850',displacement:'2.393',
    photos:['0d7c9996c80317f9.webp','607585857a018072.webp','a7ad08ca7e0f4611.webp'],
    intro:"Land Cruiser Prado có thân xe vuông vức, 7 chỗ và động cơ xăng tăng áp 2.4 L.",
    details:[
      [0, "Mặt trước Land Cruiser Prado", "Các nét ngang tạo hình cho lưới tản nhiệt và cụm đèn."],
      [1, "Cửa hậu và đèn sau", "Phần đuôi dựng đứng nối tiếp đường mui thẳng."],
    ],
  },
  alphard: {
    seats:7,wheelbase:'3.000',displacement:'2.487',
    photos:['30c50e293a8f8e6c.webp','c8b1679defa1cac2.webp','91851f36d687b42e.webp','0a5718b2fe6cd920.webp'],
    intro:"Alphard là mẫu MPV 7 chỗ với thân xe cao và cửa trượt hai bên.",
    details:[
      [1, "Mặt trước Alphard", "Lưới tản nhiệt lớn bao phủ phần lớn mặt trước."],
      [3, "Thân xe và cửa trượt", "Góc nhìn chéo cho thấy vị trí cửa trượt trên thân xe."],
    ],
  },
}

export function vehicleDetailData(model:Entry) {
  const slug = model.slug.split('/')[2]
  const profile = profiles[slug]
  const editorial = vehicleEditorial[slug]
  const photos = profile?.photos.map(photo=>'/media/'+photo) ?? []
  const studio = vehicleMenuImagery[model.slug] || model.image
  const gallery = [...new Set([studio,...photos])]
  const story = vehicleDetailImagery[model.slug] || photos[0] || studio
  const metrics: {label:string;value:string;unit?:string}[] = profile ? [
    ...(profile.displacement ? [{label:'Dung tích xi-lanh',value:profile.displacement,unit:'cc'}] : []),
    {label:'Chiều dài cơ sở',value:profile.wheelbase,unit:'mm'},
    {label:'Số chỗ ngồi',value:String(profile.seats)},
  ] : []
  const features = profile?.details.map(([photoIndex,title,detail])=>({
    title,detail,description:detail,photo:photos[photoIndex],
  })) ?? []
  const driveCards = editorial?.driveCards.map(([title,description,detail],index)=>({
    title,description,detail,photo:photos[index===0 ? 1 : 2] || studio,
  })) ?? []
  return {gallery,photos,studio,story,metrics,features,driveCards,editorial,intro:profile?.intro}
}
