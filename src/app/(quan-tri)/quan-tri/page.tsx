import type {Metadata} from 'next'
import {redirect} from 'next/navigation'
import {logout} from '../actions'
import {getAdmin} from '../session'
import styles from '../admin.module.css'

export const metadata: Metadata = {
  title: 'Khu vực quản trị | Toyota Thái Hòa Từ Liêm',
  robots: {index: false, follow: false},
}

export default async function AdminPage() {
  const admin = await getAdmin()
  if (!admin) redirect('/dang-nhap/')

  return <main className={styles.main}>
    <section className={styles.panel} aria-labelledby="admin-title">
      <p className={styles.eyebrow}>Toyota Thái Hòa Từ Liêm</p>
      <h1 id="admin-title">Khu vực quản trị</h1>
      <p>Tài khoản đang đăng nhập</p>
      <p className={styles.account}>{admin.email}</p>
      <form className={styles.form} action={logout}>
        <button type="submit">Đăng xuất</button>
      </form>
      <a href="/">Về trang chủ</a>
    </section>
  </main>
}
