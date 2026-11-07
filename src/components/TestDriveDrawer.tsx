import LeadForm from './LeadForm'

export default function TestDriveDrawer({model}:{model:string}) {
  return <dialog id="test-drive-drawer" className="technical-drawer vehicle-variant-drawer test-drive-drawer" aria-labelledby="test-drive-title">
    <div className="technical-heading vehicle-variant-heading">
      <div>
        <p className="vehicle-variant-wordmark">{model.replace(/^Toyota /i,'')}</p>
        <h2 id="test-drive-title">Đăng ký lái thử</h2>
      </div>
      <form method="dialog"><button className="vehicle-variant-close" type="submit" aria-label="Đóng" autoFocus>×</button></form>
    </div>
    <LeadForm intent="test_drive" model={model} fixedModel />
  </dialog>
}
