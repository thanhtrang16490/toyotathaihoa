import type {ReactNode} from 'react'
import {phone} from '../catalog'
import FloatingContact from '../components/FloatingContact'
import SiteFooter from '../components/SiteFooter'
import '../site.css'
export default function RootLayout({children}:{children:ReactNode}){
  return <html lang="vi"><body>{children}<SiteFooter /><FloatingContact phone={phone} /></body></html>
}
