import type {ReactNode} from 'react'
import '../site.css'
export default function RootLayout({children}:{children:ReactNode}){
  return <html lang="vi"><body>{children}</body></html>
}
