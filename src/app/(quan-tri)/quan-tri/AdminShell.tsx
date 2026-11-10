import Image from 'next/image'
import type {ReactNode} from 'react'
import logo from '../../../assets/logo.webp'
import {logout} from '../actions'
import styles from './dashboard.module.css'

export const adminSections = {
  overview: {href: '/quan-tri/?muc=tong-quan', label: 'Tổng quan', description: 'Theo dõi yêu cầu của khách và mở nhanh các mục quản trị.'},
  leads: {href: '/quan-tri/', label: 'Yêu cầu khách hàng', description: 'Xem và xử lý yêu cầu báo giá, lái thử và dịch vụ.'},
  drives: {href: '/quan-tri/?muc=lai-thu', label: 'Đăng ký lái thử', description: 'Xem xe khách chọn và liên hệ để xác nhận lịch lái thử.'},
  prices: {href: '/quan-tri/?muc=gia', label: 'Giá lăn bánh', description: 'Cập nhật giá niêm yết, giá theo khu vực và trạng thái hiển thị.'},
  products: {href: '/quan-tri/?muc=san-pham', label: 'Sản phẩm', description: 'Cập nhật mô tả và tình trạng bán của các mẫu Toyota đang có trong danh mục.'},
  news: {href: '/quan-tri/?muc=tin-tuc', label: 'Tin tức', description: 'Soạn bài, lưu nháp và quản lý bài viết trên website.'},
  users: {href: '/quan-tri/?muc=nguoi-dung', label: 'Người dùng', description: 'Tạo tài khoản, cấp quyền khi tạo và quản lý quyền đăng nhập.'},
} as const

type AdminSection = keyof typeof adminSections

const sectionIcons: Record<AdminSection, ReactNode> = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  leads: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  drives: <><path d="m5 11 2-5h10l2 5M5 17v2m14-2v2" /><rect x="3" y="11" width="18" height="6" rx="2" /><path d="M7 14h1m8 0h1" /></>,
  prices: <><path d="M7 3h10l3 3v15H4V3zM8 9h8m-8 4h8m-8 4h4" /></>,
  products: <><path d="m3 7 9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4m-9 4v10" /></>,
  news: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10m-10 4h3m3 0h4m-10 4h10" /></>,
  users: <><circle cx="10" cy="8" r="3" /><path d="M4 20v-2a6 6 0 0 1 12 0v2m1-15a3 3 0 0 1 0 6m2 3a5 5 0 0 1 2 4v2" /></>,
}

export default function AdminShell({section, email, children}: {
  section: AdminSection
  email?: string
  children: ReactNode
}) {
  const {label, description} = adminSections[section]

  return <div className={styles.dashboard}>
    <a className="skip" href="#main">Đến nội dung</a>
    <aside className={styles.sidebar}>
      <a href={adminSections.overview.href} className={styles.brand} aria-label="Toyota Thái Hòa Từ Liêm · Tổng quan">
        <Image src={logo} alt="" width={151} height={49} />
      </a>
      <p className={styles.sidebarLabel}>Quản trị đại lý</p>
      <nav className={styles.nav} aria-label="Mục quản trị">
        {(Object.keys(adminSections) as AdminSection[]).map(key => <a
          key={key} href={adminSections[key].href} aria-current={key === section ? 'page' : undefined}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{sectionIcons[key]}</svg>
          <span>{adminSections[key].label}</span>
        </a>)}
      </nav>
      <a href="/" className={styles.siteLink}>Về trang chủ <span aria-hidden="true">↗</span></a>
    </aside>
    <div className={styles.workspace}>
      <div className={styles.topbar}>
        <span className={styles.topbarTitle}>Toyota Thái Hòa Từ Liêm</span>
        <div className={styles.account}>
          <span>{email || 'Quản trị viên'}</span>
          <form action={logout}><button className={styles.secondary} type="submit">Đăng xuất</button></form>
        </div>
      </div>
      <main id="main" className={styles.content} tabIndex={-1}>
        <header className={styles.heading}>
          <p>QUẢN TRỊ ĐẠI LÝ</p>
          <h1>{label}</h1>
          <p>{description}</p>
        </header>
        {children}
      </main>
    </div>
  </div>
}
