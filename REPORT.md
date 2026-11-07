# Bàn giao kiểm kê và kiểm thử

Ngày thu thập 03/11/2026 theo giờ Việt Nam. Bản build dùng Astro và adapter Node. Trang nội dung được tạo HTML tĩnh. Node xử lý biểu mẫu, robots và chuyển hướng.

## Nguồn và phạm vi

- Bản chụp robots.txt, sitemap index, 10 sitemap con, HTML nguồn, mẫu DOM sau render và nhật ký yêu cầu mạng nằm trong `source-assets/`. Sổ liên kết gồm menu, footer, phân trang và liên kết trong HTML đã tải. Sổ tài nguyên ghi các URL quan sát từ `src`, `srcset`, lazy-load, CSS và liên kết tải. Tùy chọn màu lấy từ JSON WooCommerce khi có.
- Chromium đã cuộn trang chủ và Corolla Cross. Nhật ký ghi HTTP 200 cho cả hai mẫu, 7 và 9 phần tử form, 4 và 2 bảng, 202 và 210 URL phản hồi theo mẫu đo. Đã mở ảnh thư viện Corolla Cross. Các tab và select biến thể có trong DOM nhưng ẩn ở mẫu điện thoại. Dữ liệu mô tả, thông số và biến thể được đối chiếu với HTML và JSON nguồn.
- 14 mẫu xe mới theo danh mục trang chủ, nhóm xe cũ, phụ kiện, dịch vụ, giới thiệu, liên hệ, ưu đãi và 147 bài được chuyển vào Astro. Giá và tồn kho là dữ liệu tham khảo theo ngày thu thập. Các ưu đãi lưu trữ được trình bày theo thời điểm công bố.
- Danh mục tin giữ mẫu URL `/tin-tuc/page/N/`. Các URL cần quyết định được ghi `verify` trong `url-map.csv`. Nhóm này gồm chức năng giỏ hàng và tài khoản cũ, bản ghi kỹ thuật WordPress, truy vấn bộ lọc, một số phân trang và URL cần đối chiếu thêm với Search Console.
- Chuyển hướng 301 giữ hành trình phù hợp với nội dung đích. Home 6 về trang chủ. Alias liên hệ về trang liên hệ. Corolla Altis hiện được nguồn cũ chuyển về trang chủ nên bản mới dẫn sang danh mục xe đang giới thiệu. Đường dẫn đồng sơn cũ trả về ảnh nên bản mới dẫn sang trang dịch vụ đồng sơn.

## Đối chiếu dữ liệu

- Địa chỉ khu vực Đại Mỗ và số CSKH 0243 354 9999 khớp danh bạ Toyota Việt Nam. Các hotline theo bộ phận và Zalo lấy từ website đại lý. Giờ ở footer giữ lịch theo từng bộ phận của đại lý. Toyota Việt Nam công bố Thứ Hai–Thứ Bảy 08:00–17:00, cần đại lý xác nhận lịch chính thức. [Website đại lý](https://toyotathaihoatuliem.com.vn/) · [Danh bạ Toyota Việt Nam](https://www.toyota.com.vn/lien-he-dai-ly)
- Ví dụ Corolla Cross, bảng tùy chọn WooCommerce trên trang đại lý hiển thị giá từ 820–828 triệu đồng. Bảng giá Toyota Việt Nam tách bản 1.8V và HEV, với HEV từ 865 triệu đồng. Bản build gắn nhãn giá tham khảo và giữ dữ liệu màu theo mã nguồn để đại lý chuẩn hóa theo phiên bản. [Corolla Cross tại đại lý](https://toyotathaihoatuliem.com.vn/toyota/corolla-cross/) · [Bảng giá Toyota Việt Nam](https://www.toyota.com.vn/tin-tuc/thong-tin-bo-tro/gia-xe-toyota-moi-45677)
- URL bài `bao-duong-lop-o-to-dung-cach-bi-quyet-keo-dai-tuoi-tho-lop` có canonical tự trỏ nhưng nội dung nguồn hiện nói về cần gạt mưa. Giữ URL theo canonical và cần đối chiếu bản xuất CMS.
- Ảnh xe và nhận diện sử dụng bản tải từ nguồn. Bản build dùng 0 ảnh AI. Banner có giá và ưu đãi theo thời điểm đã được thay ở trang chủ bằng ảnh Corolla Cross, với tiêu đề và CTA HTML. Logo, ảnh chủ đạo, ảnh xưởng và ảnh bìa được xử lý responsive. Ảnh nội dung dùng đường dẫn cục bộ và tải trì hoãn.
- Manifest ghi URL, MIME, kích thước, SHA-256, trạng thái và vị trí sử dụng. Tổng hợp theo URL tài nguyên khác nhau ở `migration-summary.json`. CSS/JS WordPress chỉ dùng đối chiếu. Các link Google Maps và Zalo mở khi khách chọn. Cần đại lý cung cấp brochure, bảng giá PDF và media gốc còn thiếu, gồm ảnh showroom, đội ngũ và sự kiện đã duyệt.

## Trước khi công bố

1. Xác nhận giá, mã màu, phiên bản, thông số, tồn kho, ưu đãi, lịch làm việc, số liên hệ và vị trí bản đồ. Duyệt quyền xuất bản lại ảnh, bài viết, nội dung khách hàng và chính sách dữ liệu.
2. Cung cấp đầu nhận webhook HTTPS, thông tin xác thực, cấu hình chống gửi trùng và quyền trình đo lường. Xác minh đầu nhận thật bằng dữ liệu thử, cấu hình hạn chế tốc độ và chính sách đồng ý.
3. Dùng bản xuất CMS và Search Console để rà các mục `verify`. Quyết định các tính năng thương mại cũ và URL thiếu trang đích. Xác nhận hosting, proxy, DNS, TLS, cache, nén và kiểm soát truy cập staging.
4. Chỉ bật lập chỉ mục production sau khi kiểm thử trên hostname thực. Gửi sitemap và theo dõi URL mẫu, báo cáo 404 và Core Web Vitals trong Search Console. Điểm Lighthouse là phép đo lab. LCP, INP và CLS phân vị 75 cần dữ liệu thực tế sau triển khai.

## Kết quả build và kiểm thử

- Astro kiểm tra kiểu với 0 lỗi và 0 cảnh báo. Build sinh 262 tệp HTML. Kiểm tra qua HTTP xác nhận 258 URL sitemap đều trả 200 và có canonical tương ứng.
- 8 kiểm thử Playwright qua trên Chrome desktop và mô phỏng Pixel 7. Các luồng đã thử gồm menu, phím Tab, trang xe và điền sẵn dòng xe, biểu mẫu, dịch vụ, liên hệ, tin tức phân trang, 301 một bước, robots staging và tải trang khi chặn yêu cầu tự động ra ngoài localhost.
- Đầu nhận HTTPS cục bộ xác nhận các nhánh 422 đầu vào sai, 403 khác origin, 200 khi đầu nhận chấp thuận và 502 khi đầu nhận từ chối. Trình duyệt thử thêm nhánh 503 khi thiếu cấu hình. Kênh nhận thật cần đại lý cung cấp.
- Audit tệp build ghi nhận 0 tham chiếu tài nguyên và liên kết nội bộ hỏng trong phạm vi kiểm tra, 0 tài nguyên tải từ host ngoài và 0 PDF xuất bản. Nội dung liên kết bản đồ, Zalo và tài liệu ngoài cần kết nối khi người dùng mở.
- Bảng URL gồm 235 mục giữ nguyên, 4 mục chuyển hướng 301 và 128 mục cần xác minh. Bản tải gồm 1.221 URL tài nguyên thành công và 37 lỗi, trong đó 36 lỗi tải và 1 MIME hoặc nội dung rỗng không hợp lệ. Sau đối chiếu SHA-256 có 1.214 nội dung khác nhau. 1.137 URL nguồn tương ứng với 1.130 tệp media cục bộ trong build. Astro tạo thêm các biến thể WebP theo kích thước.

## Lighthouse mobile

Đo trên bản build cuối tại localhost với Lighthouse 12.8.2 và Headless Chrome 156. Mô phỏng mobile, RTT 150 ms và CPU chậm 4 lần. Kết quả một lượt trên từng mẫu.

| Mẫu | Performance | Accessibility | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Trang chủ | 98 | 100 | 2.329 ms | 0 ms | 0 |
| Danh mục xe | 100 | 98 | 1.579 ms | 0 ms | 0 |
| Corolla Cross | 100 | 98 | 1.653 ms | 0 ms | 0 |
| Dịch vụ | 100 | 98 | 1.428 ms | 0 ms | 0 |
| Tin tức | 100 | 98 | 1.429 ms | 0 ms | 0 |
| Nhận báo giá | 100 | 100 | 1.126 ms | 0 ms | 0 |

Cả 6 mẫu đạt mục tiêu Performance từ 90. Kết quả thô nằm trong `lighthouse-mobile.json`. Điểm Accessibility là kiểm tra tự động trên các mẫu, cần tiếp tục rà thủ công các bài và bảng nhập từ WordPress.

## Đối chiếu audit SEO của website cũ

- Đã dọn ba khối demo giao hàng, đóng gói và thành phần khỏi HTML nhập. Kiểm tra build phát hiện lại các dấu hiệu demo, H1 sai số lượng, thiếu thuộc tính alt và đoạn meta «Continue reading». Đã sửa liên kết có nhãn «bảo hiểm» trỏ nhầm sang đồng sơn.
- Hilux, Corolla Cross, Yaris Cross và Innova Cross giữ trang và ảnh xe. Giá, thông số và tùy chọn nhập có xung đột được tạm ẩn đến khi đại lý duyệt bảng theo phiên bản. Danh mục xe cũ chờ tồn kho xác nhận. URL chi tiết xe cũ tiếp tục phục vụ dưới dạng thông tin lưu trữ.
- URL Corolla Cross đời cũ chuyển 301 đến trang mẫu xe. URL không xác định phải trả 404. Trang shop cũ được gắn noindex và loại khỏi sitemap.
- Chuyển HTTP/www sang HTTPS canonical và HSTS cần cấu hình, kiểm chứng ở proxy/CDN production. Trạng thái lập chỉ mục cũ và Core Web Vitals thực tế cần Search Console và dữ liệu sau triển khai. Giá lăn bánh, trả góp, dữ liệu màu, giá và đánh giá dùng cho schema cần nguồn đã được duyệt.
