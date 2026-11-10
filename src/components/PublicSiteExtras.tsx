import {phone} from '../catalog'
import FloatingContact from './FloatingContact'
import SiteFooter from './SiteFooter'

export default function PublicSiteExtras() {
  return <><SiteFooter /><FloatingContact phone={phone} /></>
}
