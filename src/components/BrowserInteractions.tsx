'use client'
import {useEffect} from 'react'
declare global { interface Window { dataLayer?: Record<string, unknown>[] } }
export default function BrowserInteractions({path}:{path:string}){
 useEffect(()=>{
 const controller=new AbortController()
 const {signal}=controller


{

  const controls = document.querySelector<HTMLElement>('.catalog-controls')
  const segment = document.querySelector<HTMLSelectElement>('#segment')
  const search = document.querySelector<HTMLInputElement>('#model-search')
  const count = document.querySelector('#model-count')
  if (controls && segment && search && count) {
    const cards = document.querySelectorAll<HTMLElement>('.collection [data-model]')
    const normalize = (value: string) => value.toLocaleLowerCase('vi').normalize('NFD').replace(/\p{Diacritic}/gu, '').replaceAll('đ', 'd').trim()
    const update = () => {
      const query = normalize(search.value)
      let visible = 0
      for (const card of cards) {
        card.hidden = (!!segment.value && card.dataset.category !== segment.value) || !normalize(card.dataset.model ?? '').includes(query)
        if (!card.hidden) visible++
      }
      count.textContent = visible ? `${visible} mẫu xe phù hợp` : 'Không tìm thấy mẫu xe phù hợp.'
    }
    search.addEventListener('input', update, {signal})
    segment.addEventListener('change', update, {signal})
    document.querySelector('#clear-filters')?.addEventListener('click', () => {
      search.value = ''
      segment.value = ''
      update()
      search.focus()
    },{signal})
    controls.hidden = false
    update()
  }
  for(const table of document.querySelectorAll('.source-content table:not(.table-scroll table)')){
    const region=document.createElement('div')
    region.className='table-scroll'
    region.tabIndex=0
    region.setAttribute('role','region')
    region.setAttribute('aria-label','Bảng thông tin, cuộn ngang để xem thêm')
    table.replaceWith(region)
    region.append(table)
  }

}
{

  for(const form of document.querySelectorAll<HTMLFormElement>('[data-lead-form]')){
    const model = form.elements.namedItem('model')
    const initial = new URLSearchParams(location.search).get('model')
    if(model instanceof HTMLSelectElement && initial && Array.from(model.options).some(option=>option.value===initial)) model.value=initial
    const params = new URLSearchParams(location.search)
    const selection = form.querySelector<HTMLElement>('.lead-selection')
    const syncSelection = () => {
      if (!selection || !(model instanceof HTMLSelectElement)) return
      const labels = []
      for (const [key, label] of [['trim', 'Phiên bản'], ['color', 'Màu xe']]) {
        const field = form.elements.namedItem(key)
        if (!(field instanceof HTMLInputElement)) continue
        field.value = initial && model.value === initial ? (params.get(key) ?? '').trim().slice(0, 100) : ''
        if (field.value) labels.push(label + ': ' + field.value)
      }
      selection.textContent = labels.join(' · ')
      selection.hidden = !labels.length
    }
    if (model instanceof HTMLSelectElement) model.addEventListener('change', syncSelection, {signal})
    syncSelection()
    const status = form.querySelector<HTMLElement>('.form-status')!
    const button = form.querySelector<HTMLButtonElement>('button')!
    let retryKey:string|undefined
    form.addEventListener('input',()=>{retryKey=undefined},{signal})
    form.addEventListener('submit', async event=>{
      event.preventDefault()
      button.disabled=true
      status.textContent='Đang gửi yêu cầu…'
      const body=new URLSearchParams()
      for(const [key,value] of new FormData(form)) if(typeof value==='string') body.append(key,value)
      try{
        retryKey ??= crypto.randomUUID()
        const response=await fetch(form.action,{method:'POST',body,headers:{'Idempotency-Key':retryKey}})
        const result=await response.json()
        status.textContent=result.message
        if(response.ok){
          ;(window.dataLayer ??= []).push({event:'lead_success',intent:body.get('intent'),page_path:location.pathname})
          retryKey=undefined
          form.reset()
          syncSelection()
        }
      }catch{
        status.textContent='Không kết nối được. Vui lòng thử lại hoặc gọi hotline.'
      }finally{
        button.disabled=false
        status.focus()
      }
    },{signal})
  }

}
{

  const form = document.querySelector<HTMLFormElement>('[data-vehicle-options]')
  const cover = document.querySelector<HTMLImageElement>('.product-cover')
  const preview = form?.querySelector<HTMLImageElement>('.option-preview')
  if (form && cover && preview) {
    const original = {src: cover.getAttribute('src')!, srcset: cover.getAttribute('srcset'), alt: cover.alt}
    const drawer = form.closest('dialog')
    const heroColors = document.querySelectorAll<HTMLAnchorElement>('[data-hero-color]')
    const colorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href="#chon-phien-ban"]')
    for (const link of colorLinks) {
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        if (!drawer?.showModal) return
        event.preventDefault()
        drawer.showModal()
        const option = Array.from(form.querySelectorAll<HTMLInputElement>('input[name=color]'))
          .find(input => input.value === link.dataset.heroColor)
        option?.click()
      }, {signal})
    }
    const update = () => {
      const color = form.querySelector<HTMLInputElement>('input[name=color]:checked')
      for (const link of heroColors) {
        if (link.dataset.heroColor === color?.value) link.setAttribute('aria-current','true')
        else link.removeAttribute('aria-current')
      }
      const photo = color?.dataset.photo
      if (photo || !original.srcset) cover.removeAttribute('srcset')
      else cover.setAttribute('srcset', original.srcset)
      cover.src = photo || original.src
      cover.alt = photo ? original.alt + ' · ' + color?.value : original.alt
      preview.hidden = !photo
      if (photo) preview.src = photo
      preview.alt = photo ? cover.alt : ''
    }
    form.addEventListener('change', update, {signal})
    window.addEventListener('pageshow', update, {signal})
  }

}
{

  const track = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-event],a[href^="tel:"]') : null
    if (!target) return
    const href = target.getAttribute('href')
    ;(window.dataLayer ??= []).push({event: target.dataset.event ?? 'hotline_click', page_path: location.pathname, ...(href?.startsWith('/') ? {target_path: href.split('?')[0]} : {})})
  }
  document.addEventListener('click',track,{signal})
}
 return ()=>controller.abort()
 },[path])
 return null
}
