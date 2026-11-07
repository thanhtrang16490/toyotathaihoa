# Toyota Thái Hòa Từ Liêm

Website Next.js App Router tạo HTML tĩnh cho danh mục xe, nội dung đại lý và bài viết. Node phục vụ API lead, robots.txt và chuyển hướng.

## Chạy local

Yêu cầu Node.js 22 và npm. Chrome cài sẵn để chạy Playwright.

```sh
npm ci
npm run dev
npm run check
npm run build
npm start
# Terminal khác
npm test
```

## Cập nhật nội dung

- Dữ liệu đã trích xuất nằm trong `src/data.json`. Mỗi trang có URL và ngày thu thập. Bảng và tùy chọn từ WooCommerce có trường dữ liệu riêng khi tìm thấy. Giá công bố, giá theo mã màu và giá thực tế cần được đối chiếu trước khi mở lập chỉ mục.
- `src/catalog.ts` quản lý nhóm trang và thông tin đại lý. Sửa thông tin đã duyệt tại đây và build lại. Chỉ dùng ảnh gốc đã được cấp quyền cho xe, màu và nội thất.
- `source-assets/` lưu bản chụp phục vụ đối chiếu. Build bằng `npm run build` và chạy `npm start` cùng thư mục `.next/`, `public/` và phụ thuộc Node.
- `node scripts/inspect-origin.mjs` thu mẫu mạng và DOM sau render. `node scripts/collect.mjs` đọc các sitemap đã lưu, tải trang và tạo lại dữ liệu, manifest và bảng URL. Chạy trong checkout riêng để đối chiếu trước khi thay thế dữ liệu đã duyệt.
- `asset-manifest.csv` phân biệt đường dẫn lưu trữ và đường dẫn phục vụ. Logo, ảnh chủ đạo, ảnh xưởng và ảnh bìa xe được Next.js xử lý. Ảnh nội dung và PDF được tham chiếu từ bản cục bộ trong `public/media/`.

## Nhận lead và đo lường

Thiết lập biến môi trường cho tiến trình Node theo `.env.example`. Cấu hình `LEAD_WEBHOOK_URL` là HTTPS, cùng `LEAD_WEBHOOK_TOKEN` nếu đầu nhận yêu cầu xác thực Bearer. Đầu nhận phải trả HTTP 2xx và JSON `{"accepted":true}` sau khi tiếp nhận. Payload gồm `name`, `phone`, `intent`, `model`, `received_at`. Đầu nhận nên khử yêu cầu trùng theo header `Idempotency-Key` khi khách thử lại. Thiết lập giới hạn tốc độ cho POST `/api/lead/` ở reverse proxy và xác minh proxy giữ đúng origin/host. Kiểm thử với dữ liệu giả trước khi bật cho khách.

Sự kiện `cta_click`, `hotline_click`, `zalo_click`, `directions_click` và `lead_success` được đẩy vào `window.dataLayer`. Kết nối trình đo lường do đại lý phê duyệt, thiết lập đồng ý phù hợp, rồi kiểm tra bằng chế độ xem trước. Chỉ gửi đường dẫn trang và đích nội bộ hoặc loại yêu cầu. Dữ liệu nhập trên biểu mẫu được gửi riêng đến đầu nhận lead.

## Chuyển đổi SEO

- Đối chiếu `url-map.csv` với sitemap, liên kết từ trang gốc và bản xuất Search Console. Các dòng `verify` cần quyết định trước khi đổi DNS. Kiểm tra danh mục phân trang và các URL WooCommerce với đại lý.
- Staging mặc định có meta noindex và robots chặn crawl. Khi duyệt production, dùng `SITE_INDEXABLE=true npm run build` và đặt cùng biến khi chạy Node. Dùng staging riêng có kiểm soát truy cập trong thời gian duyệt.
- Dùng proxy HTTPS. Cho phép cache dài và immutable cho `/_next/static/`. Thiết lập cache tài nguyên `/media/` theo chính sách CDN, bật Brotli hoặc gzip cho HTML/CSS/JS và giữ API ở chế độ no-store.
- Trước khi chuyển DNS, đối chiếu trạng thái 301, đích cuối 200, canonical HTTPS, sitemap và robots trên cấu hình triển khai thực. Sau chuyển đổi, gửi `/sitemap.xml` trong Search Console, kiểm tra URL mẫu, theo dõi lỗi lập chỉ mục, 404 và chuyển hướng. Theo dõi Core Web Vitals thực tế khi có đủ dữ liệu.

Proxy cần ghi đè các header forwarded do khách gửi và truyền host/proto đã xác thực. Kiểm tra POST trên URL HTTPS triển khai.

Chạy `npm run audit` để kiểm tra tham chiếu trong bản build, `node scripts/check-lead.mjs` để thử API với đầu nhận HTTPS cục bộ và `node scripts/lighthouse.mjs` để đo Lighthouse mobile trên server local.
