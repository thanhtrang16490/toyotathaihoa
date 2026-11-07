# Đối chiếu thiết kế Porsche và Toyota Thái Hòa Từ Liêm

Khảo sát ngày 03/11/2026 bằng Chrome desktop 1440 × 900 và mô phỏng Pixel 7 ở 412 × 839. Cả hai phiên truy cập porsche.com chuyển đến [Porsche Việt Nam](https://www.porsche.com/pap/_vietnam_/?cs_redirect=1). Danh mục và trang 911 GT3 được khảo sát ở bản International.

| Quan sát | Áp dụng trong Astro |
| --- | --- |
| Trang chủ Porsche dùng một ảnh xe lớn, tiêu đề ngắn và một hành động khám phá. | Hero Corolla Cross dùng ảnh tĩnh Toyota và CTA khám phá dòng xe. Desktop đặt chữ trên vùng ảnh có lớp tối. Mobile xếp ảnh trên khối chữ để giữ thân xe trong khung. |
| Trang chủ Porsche dẫn từ hero đến các dòng xe và các điểm vào hành trình mua xe. | Ngay dưới hero là ba lối vào dòng xe, ưu đãi và bảo dưỡng. Các khối ảnh xe và xưởng dịch vụ dẫn tới nội dung tương ứng. |
| Danh mục Porsche tạo nhịp bằng ảnh, tên mẫu và thông tin chọn xe. | Các thẻ Toyota dùng ảnh tỷ lệ 16:9, nhóm xe, tên mẫu, giá tham khảo khi có và CTA Khám phá xe. Lưới chuyển từ ba cột sang hai rồi một theo chiều rộng. |
| Trang 911 GT3 đặt tên xe và thao tác chọn phiên bản gần ảnh chính, sau đó dẫn xuống nội dung kỹ thuật. | Trang xe Toyota mở bằng ảnh, tên xe và nhóm báo giá/lái thử cạnh bộ chọn phiên bản và màu. Thư viện ảnh đứng trước nội dung thông số. CTA nằm trong luồng nội dung trên mobile. |

Nguồn khảo sát gồm [trang chủ Porsche Việt Nam](https://www.porsche.com/pap/_vietnam_/?cs_redirect=1), [danh mục Porsche International](https://www.porsche.com/international/models/) và [Porsche 911 GT3](https://www.porsche.com/international/models/911/911-gt3-models/911-gt3/).

Bản triển khai dùng logo, ảnh Toyota và font hệ thống có dấu tiếng Việt. Giá đang đối chiếu hiển thị yêu cầu liên hệ. Thư mục media hiện thiếu brochure PDF chính thức cho trang xe mẫu. Trang ưu đãi tiếp tục phân biệt chương trình đã công bố với ưu đãi cần đại lý xác nhận hiệu lực.

| Trang | Desktop | Mobile |
| --- | --- | --- |
| Trang chủ | [Ảnh](home-desktop.png) | [Ảnh](home-mobile.png) |
| Danh mục xe | [Ảnh](catalog-desktop.png) | [Ảnh](catalog-mobile.png) |
| Corolla Cross | [Ảnh](corolla-desktop.png) | [Ảnh](corolla-mobile.png) |

## Lighthouse mobile

Bản build cuối trên localhost. Lighthouse 12.8.2 mô phỏng mobile với CPU chậm 4 lần. Mục tiêu Performance từ 90.

| URL | Performance | LCP (ms) | CLS |
| --- | ---: | ---: | ---: |
| / | 99 | 1954 | 0 |
| /xe-toyota-moi/ | 100 | 1579 | 0 |
| /toyota/corolla-cross/ | 89 | 3833 | 0 |

[JSON kết quả](lighthouse-mobile.json). Cả 10 kiểm thử desktop/mobile đều qua và 257 URL sitemap trả HTTP 200 với canonical đúng.

Corolla Cross đạt 89 ở lượt đầu và 100 ở lượt đo riêng trên cùng bản build, với LCP 1504 ms. Hai kết quả được lưu để thể hiện độ dao động của phép đo.
