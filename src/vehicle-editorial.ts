type Editorial = {
  headline:string
  driveIntro:string
  driveCards:readonly [title:string,summary:string,body:string][]
}

export const vehicleEditorial:Record<string,Editorial> = {
  'toyota-land-cruiser-fj': {
    headline:'Dáng vuông của Land Cruiser',
    driveIntro:'Động cơ xăng 2.7 L và hệ dẫn động hai cầu bán thời gian trên một thân xe gọn.',
    driveCards:[
      ['Động cơ xăng 2.7 L','164 hp và 245 Nm.','Động cơ 2TR-FE kết hợp hộp số tự động 6 cấp. Công suất cực đại đạt tại 5.200 vòng/phút, mô-men xoắn cực đại đạt tại 4.000 vòng/phút.'],
      ['Hai cầu bán thời gian','Chọn chế độ dẫn động phù hợp với bề mặt đường.','Chế độ hai cầu hỗ trợ tạo lực kéo khi di chuyển trên bề mặt trơn hoặc rời. Sử dụng chế độ dẫn động theo hướng dẫn của nhà sản xuất.'],
    ],
  },
  'yaris-cross': {
    headline:'Dáng SUV gọn cho phố đông',
    driveIntro:'Chọn động cơ xăng hoặc HEV, tùy theo nhịp đi lại của bạn.',
    driveCards:[
      ['Hai hệ truyền động','Xăng 1.5 L hoặc Hybrid.','Bản xăng đi cùng CVT. Bản Hybrid kết hợp động cơ xăng và mô-tơ điện với hộp số vô cấp điện tử.'],
      ['Quan sát khi xoay trở','Camera 360° trên bản HEV.','Các góc nhìn quanh xe giúp người lái quan sát vạch đỗ và vật cản khi thao tác ở tốc độ thấp.'],
    ],
  },
  vios:{
    headline:'Chiếc sedan cho mỗi ngày',
    driveIntro:'Động cơ xăng 1.5 L với lựa chọn số sàn hoặc CVT.',
    driveCards:[
      ['Xăng 1.5 L','Cùng dung tích 1.496 cc ở các bản.','Bản 1.5E MT dùng hộp số sàn 5 cấp. Hai bản 1.5E CVT và 1.5G CVT dùng hộp số vô cấp.'],
      ['Lựa chọn hộp số','So sánh số sàn và số tự động.','Số sàn cho phép người lái chủ động chọn cấp số. CVT tự thay đổi tỷ số truyền khi tăng hoặc giảm tốc.'],
    ],
  },
  'innova-cross':{
    headline:'Ba hàng ghế, hai cách bố trí',
    driveIntro:'Hai bản xăng 8 chỗ và bản Hybrid 7 chỗ với hàng ghế thứ hai độc lập.',
    driveCards:[
      ['Xăng hoặc Hybrid','Cùng dung tích động cơ xăng 1.987 cc.','Bản 2.0G và 2.0V sử dụng động cơ xăng và CVT. Bản 2.0HEV bổ sung mô-tơ điện và dùng hộp số vô cấp điện tử.'],
      ['Cấu hình 7 hoặc 8 chỗ','Chọn theo số người thường xuyên đi cùng.','Hai bản xăng có 8 chỗ. Bản 2.0HEV có 7 chỗ và hai ghế riêng ở hàng thứ hai.'],
    ],
  },
  hilux:{
    headline:'Cabin kép và thùng hàng riêng',
    driveIntro:'Diesel tăng áp 2.8 L trên cả ba phiên bản, với lựa chọn 4×2 hoặc 4×4.',
    driveCards:[
      ['Diesel tăng áp 2.8 L','Dung tích 2.755 cc.','Standard dùng hộp số sàn 6 cấp. Pro và Trailhunter dùng hộp số tự động 6 cấp.'],
      ['Dẫn động 4×2 hoặc 4×4','Trailhunter có hệ dẫn động hai cầu.','Standard và Pro dùng dẫn động 4×2. Trailhunter 4×4 là lựa chọn trong danh mục khi cần vận hành trên đường có độ bám thấp.'],
    ],
  },
  camry:{
    headline:'Dáng sedan, chiều dài cơ sở 2.825 mm',
    driveIntro:'Bản 2.0Q dùng động cơ xăng, còn hai bản HEV kết hợp động cơ xăng với mô-tơ điện.',
    driveCards:[
      ['Camry 2.0Q','Xăng 2.0 L và hộp số CVT.','Bản 2.0Q dùng động cơ xăng dung tích 1.987 cc, kết hợp hộp số tự động vô cấp.'],
      ['Camry HEV','Hybrid 2.5 L và hộp số e-CVT.','HEV Premium và HEV Luxury kết hợp động cơ xăng dung tích 2.487 cc với mô-tơ điện.'],
    ],
  },
  fortuner:{
    headline:'Một dáng SUV, ba hàng ghế',
    driveIntro:'Các bản Fortuner trong danh mục có lựa chọn động cơ xăng hoặc diesel và dẫn động 4×2 hoặc 4×4.',
    driveCards:[
      ['Động cơ xăng 2.7 L','Dung tích 2.694 cc.','Các bản xăng trong danh mục đi cùng hộp số tự động 6 cấp. Kiểm tra kiểu dẫn động ở từng phiên bản.'],
      ['Diesel tăng áp','Lựa chọn 2.4 L hoặc 2.8 L.','Thông số dung tích và kiểu dẫn động thay đổi theo phiên bản. Xem thẻ thông số của xe bạn quan tâm.'],
    ],
  },
  raize:{
    headline:'SUV nhỏ gọn với gầm cao 200 mm',
    driveIntro:'Động cơ tăng áp 1.0 L, hộp số CVT và bán kính quay tối thiểu 5,1 m.',
    driveCards:[
      ['Động cơ tăng áp 1.0 L','Mô-men xoắn tối đa 140 Nm.','Động cơ xăng 998 cc kết hợp CVT. Mô-men xoắn cực đại đạt trong dải 2.400–4.000 vòng/phút.'],
      ['Cảnh báo điểm mù','Hỗ trợ quan sát khi chuyển làn.','Hệ thống BSM cảnh báo khi phát hiện phương tiện ở vùng khó quan sát bên cạnh xe, trong các điều kiện hoạt động phù hợp.'],
    ],
  },
  wigo:{
    headline:'Một chiếc hatchback dài 3,76 m',
    driveIntro:'Bản G kết hợp động cơ xăng 1.198 cc với hộp số tự động vô cấp.',
    driveCards:[
      ['Xăng 1.2 L và CVT','Hộp số tự động trên bản G.','Hộp số vô cấp tự điều chỉnh tỷ số truyền trong quá trình tăng hoặc giảm tốc.'],
      ['Cảnh báo khi lùi','Hỗ trợ phát hiện xe cắt ngang phía sau.','Hệ thống RCTA trên Wigo G hỗ trợ người lái khi lùi khỏi vị trí đỗ có tầm quan sát hạn chế.'],
    ],
  },
  'veloz-cross':{
    headline:'Ba hàng ghế, thêm chế độ sofa',
    driveIntro:'Cả hai bản đều dùng động cơ xăng 1.5 L và CVT. CVT TOP có thêm gói an toàn Toyota Safety Sense.',
    driveCards:[
      ['Xăng 1.5 L và CVT','Cấu hình động cơ chung cho cả hai bản.','Động cơ xăng 1.496 cc kết hợp hộp số tự động vô cấp trên CVT và CVT TOP.'],
      ['Toyota Safety Sense','Có trên CVT TOP.','Gói hỗ trợ người lái trên bản TOP gồm các tính năng như cảnh báo tiền va chạm trong điều kiện hoạt động phù hợp.'],
    ],
  },
  'avanza-premio':{
    headline:'Bảy chỗ cho những chuyến đi cùng nhau',
    driveIntro:'Cùng động cơ xăng 1.5 L, với lựa chọn hộp số sàn hoặc tự động vô cấp.',
    driveCards:[
      ['Xăng 1.5 L','Động cơ 2NR-VE, dung tích 1.496 cc.','Hai bản MT và CVT dùng chung động cơ. Người lái có thể chọn hộp số phù hợp với nhu cầu sử dụng.'],
      ['Sáu túi khí','Trang bị trên bản CVT.','Bản CVT có túi khí phía trước, túi khí bên hông phía trước và túi khí rèm.'],
    ],
  },
  'toyota-land-prado':{
    headline:'Thân xe vuông vức, ba hàng ghế',
    driveIntro:'Động cơ xăng 2.4 L tăng áp phối hợp với hộp số tự động 8 cấp.',
    driveCards:[
      ['Xăng tăng áp 2.4 L','Dung tích 2.393 cc.','Cả Land Cruiser Prado và Land Cruiser Prado M dùng động cơ xăng tăng áp và hộp số tự động 8 cấp.'],
      ['Dẫn động hai cầu','Hệ dẫn động 4×4.','Dẫn động đến cả hai cầu hỗ trợ khả năng bám đường trong các điều kiện vận hành phù hợp.'],
    ],
  },
  alphard:{
    headline:'Hai cửa trượt, ba hàng ghế',
    driveIntro:'Alphard HEV kết hợp động cơ xăng 2.5 L với hệ truyền động điện.',
    driveCards:[
      ['Hybrid 2.5 L','Động cơ xăng 2.487 cc kết hợp mô-tơ điện.','Hệ truyền động Hybrid sử dụng hộp số vô cấp điện tử e-CVT.'],
      ['Hàng ghế thứ hai','Hai ghế riêng trong khoang 7 chỗ.','Hai cửa trượt hai bên giúp tiếp cận hàng ghế thứ hai trong không gian đỗ hẹp.'],
    ],
  },
}
