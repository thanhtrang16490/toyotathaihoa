import type {Metadata} from 'next'
import {redirect} from 'next/navigation'
import {login} from '../actions'
import {getAdmin} from '../session'
import styles from '../admin.module.css'

export const metadata: Metadata = {
  title: 'Đăng nhập quản trị | Toyota Thái Hòa Từ Liêm',
  robots: {index: false, follow: false},
}

export default async function LoginPage({searchParams}: {
  searchParams: Promise<{loi?: string}>
}) {
  const [admin, query] = await Promise.all([getAdmin(), searchParams])
  if (admin) redirect('/quan-tri/?muc=tong-quan')

  return <main className={styles.main}>
    <section className={styles.panel} aria-labelledby="login-title">
      <p className={styles.eyebrow}>Toyota Thái Hòa Từ Liêm</p>
      <h1 id="login-title">Đăng nhập quản trị</h1>
      <p>Đăng nhập bằng tài khoản quản trị của đại lý.</p>
      {query.loi === '1' && <p className={styles.error} role="alert">
        Không thể đăng nhập. Vui lòng kiểm tra thông tin tài khoản và thử lại.
      </p>}
      <form className={styles.form} action={login}>
        <label>Email
          <input name="email" type="email" autoComplete="username" maxLength={254} required />
        </label>
        <label>Mật khẩu
          <input name="password" type="password" autoComplete="current-password" maxLength={256} required />
        </label>
        <button type="submit">Đăng nhập</button>
      </form>
      <a href="/">Về trang chủ</a>
    </section>
  </main>
}
