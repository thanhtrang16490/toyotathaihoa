export type VehicleGrade = {
  name:string
  powertrain:string
  transmission:string
  seats:number
  drive?:string
}

// Tham chiếu danh mục xe, catalogue và bảng thông số Toyota Việt Nam.
const petrol15 = 'Xăng 1.496 cc'
const diesel28 = 'Diesel tăng áp 2.755 cc'
const hybrid25 = 'Hybrid xăng–điện 2.487 cc'
const cvt = 'Tự động vô cấp (CVT)'
const ecvt = 'Vô cấp điện tử (e-CVT)'
const manual = 'Số sàn 5 cấp'
const auto6 = 'Tự động 6 cấp'

const grades:Record<string,readonly VehicleGrade[]> = {
  'corolla-cross':[
    {name:'1.8V',powertrain:'Xăng 1.798 cc',transmission:cvt,seats:5},
    {name:'HEV',powertrain:'Hybrid xăng–điện 1.798 cc',transmission:ecvt,seats:5},
  ],
  'toyota-land-cruiser-fj':[
    {name:'2.7 AT',powertrain:'Xăng 2.694 cc',transmission:auto6,seats:5,drive:'Hai cầu bán thời gian'},
  ],
  'yaris-cross':[
    {name:'Xăng',powertrain:petrol15,transmission:cvt,seats:5},
    {name:'Hybrid',powertrain:'Hybrid xăng–điện 1.496 cc',transmission:ecvt,seats:5},
  ],
  vios:[
    {name:'1.5E MT',powertrain:petrol15,transmission:manual,seats:5},
    {name:'1.5E CVT',powertrain:petrol15,transmission:cvt,seats:5},
    {name:'1.5G CVT',powertrain:petrol15,transmission:cvt,seats:5},
  ],
  'innova-cross':[
    {name:'2.0G',powertrain:'Xăng 1.987 cc',transmission:cvt,seats:8},
    {name:'2.0V',powertrain:'Xăng 1.987 cc',transmission:cvt,seats:8},
    {name:'2.0HEV',powertrain:'Hybrid xăng–điện 1.987 cc',transmission:ecvt,seats:7},
  ],
  hilux:[
    {name:'Standard 4×2 MT',powertrain:diesel28,transmission:'Số sàn 6 cấp',seats:5,drive:'4×2'},
    {name:'Pro 4×2 AT',powertrain:diesel28,transmission:auto6,seats:5,drive:'4×2'},
    {name:'Trailhunter 4×4',powertrain:diesel28,transmission:auto6,seats:5,drive:'4×4'},
  ],
  camry:[
    {name:'2.0Q',powertrain:'Xăng 1.987 cc',transmission:cvt,seats:5},
    {name:'HEV Premium',powertrain:hybrid25,transmission:ecvt,seats:5},
    {name:'HEV Luxury',powertrain:hybrid25,transmission:ecvt,seats:5},
  ],
  fortuner:[
    {name:'2.7 AT 4×2',powertrain:'Xăng 2.694 cc',transmission:auto6,seats:7,drive:'4×2'},
    {name:'Legender 2.7 AT 4×2',powertrain:'Xăng 2.694 cc',transmission:auto6,seats:7,drive:'4×2'},
    {name:'Legender 2.4 AT 4×2',powertrain:'Diesel tăng áp 2.393 cc',transmission:auto6,seats:7,drive:'4×2'},
    {name:'Legender 2.7 AT 4×4',powertrain:'Xăng 2.694 cc',transmission:auto6,seats:7,drive:'4×4'},
    {name:'Legender 2.8 AT 4×4',powertrain:diesel28,transmission:auto6,seats:7,drive:'4×4'},
  ],
  raize:[{name:'1.0 Turbo',powertrain:'Xăng tăng áp 998 cc',transmission:cvt,seats:5}],
  wigo:[{name:'G',powertrain:'Xăng 1.198 cc',transmission:cvt,seats:5}],
  'veloz-cross':[
    {name:'CVT',powertrain:petrol15,transmission:cvt,seats:7},
    {name:'CVT TOP',powertrain:petrol15,transmission:cvt,seats:7},
  ],
  'avanza-premio':[
    {name:'1.5L MT',powertrain:petrol15,transmission:manual,seats:7},
    {name:'1.5L CVT',powertrain:petrol15,transmission:cvt,seats:7},
  ],
  'toyota-land-prado':[
    {name:'Land Cruiser Prado',powertrain:'Xăng tăng áp 2.393 cc',transmission:'Tự động 8 cấp',seats:7,drive:'4×4'},
    {name:'Land Cruiser Prado M',powertrain:'Xăng tăng áp 2.393 cc',transmission:'Tự động 8 cấp',seats:7,drive:'4×4'},
  ],
  alphard:[{name:'HEV',powertrain:hybrid25,transmission:ecvt,seats:7}],
}

export function vehicleGrades(path:string) {
  return grades[path.split('/')[2]] ?? []
}

export function gradeAnchor(index:number) {
  return 'thong-so-phien-ban-'+(index+1)
}
