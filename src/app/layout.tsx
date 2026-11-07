import type {ReactNode} from 'react'
import SiteFooter from '../components/SiteFooter'
import '../site.css'
export default function RootLayout({children}:{children:ReactNode}){
  return <html lang="vi"><body>{children}<SiteFooter /></body></html>
}
