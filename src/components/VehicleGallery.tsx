'use client'

import {useEffect,useRef,useState} from 'react'

const fjCaptions: Record<string, [string, string]> = {
  '/media/36c91af4c0c9e3ee.webp': ['Thiết kế ngoại thất', 'Thân xe vuông vức và vòm bánh rõ nét tạo nên dáng Land Cruiser đặc trưng.'],
  '/media/62f522f143914703.webp': ['Vận hành', 'Động cơ xăng 2,7 L kết hợp hộp số tự động 6 cấp.'],
}

export default function VehicleGallery({images,title,editorial=false}:{images:string[],title:string,editorial?:boolean}) {
  const [interactive,setInteractive]=useState(false)
  useEffect(()=>setInteractive(true),[])
  const track = useRef<HTMLDivElement>(null)
  const scroll = (direction:number) => {
    const list = track.current
    const card = list?.firstElementChild
    if (list && card) list.scrollBy({left: direction * (card.clientWidth + 16)})
  }
  const dialog = useRef<HTMLDialogElement>(null)
  const [index,setIndex] = useState(0)
  const [opened,setOpened] = useState(false)
  const move = (step:number) => setIndex(current => (current + step + images.length) % images.length)

  return <>
    {editorial && <div className="fj-gallery-controls">
      <button type="button" className="btn outline" aria-label="Góc nhìn trước" onClick={()=>scroll(-1)}>←</button>
      <button type="button" className="btn outline" aria-label="Góc nhìn tiếp theo" onClick={()=>scroll(1)}>→</button>
    </div>}
    <div ref={track} inert={!interactive} className={editorial ? 'fj-gallery-track' : 'gallery model-gallery'}>
      {images.map((src,i) => {
        const caption = editorial ? fjCaptions[src] : undefined
        return <a key={src} href={src} aria-label={'Mở ảnh '+(i+1)} onClick={event=>{
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.current?.showModal) return
        event.preventDefault()
        setIndex(i)
        setOpened(true)
        dialog.current.showModal()
      }}><img src={src} alt={title+' · ảnh '+(i+1)} loading="lazy" width={400} height={300} />
        {caption && <div className="fj-gallery-caption"><h3>{caption[0]}</h3><p>{caption[1]}</p></div>}
      </a>
      })}
    </div>
    <dialog ref={dialog} className="vehicle-lightbox" aria-label={'Thư viện '+title} onClose={()=>setOpened(false)} onKeyDown={event=>{
      if (event.key==='ArrowLeft') move(-1)
      if (event.key==='ArrowRight') move(1)
    }}>
      <div className="lightbox-top">
        <span>{title}</span>
        <button className="btn outline" type="button" onClick={()=>dialog.current?.close()}>Đóng</button>
      </div>
      {opened && <img src={images[index]} alt={title+' · ảnh '+(index+1)} />}
      {images.length>1 && <div className="lightbox-top">
        <button className="btn outline" type="button" onClick={()=>move(-1)}>Ảnh trước</button>
        <span role="status">{index+1} / {images.length}</span>
        <button className="btn outline" type="button" onClick={()=>move(1)}>Ảnh sau</button>
      </div>}
    </dialog>
  </>
}
