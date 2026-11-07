'use client'
import {useEffect} from 'react'
import {todayInVietnam} from '../test-drive'
declare global { interface Window { dataLayer?: Record<string, unknown>[] } }
export default function BrowserInteractions({path}:{path:string}){
 useEffect(()=>{
 const controller=new AbortController()
 const {signal}=controller


{

  const controls = document.querySelector<HTMLDetailsElement>('details.catalog-controls')
  const segment = document.querySelector<HTMLSelectElement>('#segment')
  const search = document.querySelector<HTMLInputElement>('#model-search')
  const count = document.querySelector('#model-count')
  const filterCount = document.querySelector('#active-filter-count')
  const fuel = document.querySelector<HTMLSelectElement>('#model-fuel')
  if (controls && segment && search && fuel && count) {
    const cards = document.querySelectorAll<HTMLElement>('.collection [data-model]')
    const normalize = (value: string) => value.toLocaleLowerCase('vi').normalize('NFD').replace(/\p{Diacritic}/gu, '').replaceAll('đ', 'd').trim()
    const update = () => {
      const query = normalize(search.value)
      if (filterCount) {
        const active = [query,segment.value,fuel.value].filter(Boolean).length
        filterCount.textContent = active ? ` (${active})` : ''
      }
      let visible = 0
      for (const card of cards) {
        card.hidden = (!!segment.value && card.dataset.category !== segment.value) || (!!fuel.value && !card.dataset.fuel?.split(' ').includes(fuel.value)) || !normalize(card.dataset.model ?? '').includes(query)
        if (!card.hidden) visible++
      }
      count.textContent = visible ? `${visible} mẫu xe phù hợp` : 'Không tìm thấy mẫu xe phù hợp.'
    }
    search.addEventListener('input', update, {signal})
    segment.addEventListener('change', update, {signal})
    fuel.addEventListener('change', update, {signal})
    document.querySelector('#clear-filters')?.addEventListener('click', () => {
      search.value = ''
      segment.value = ''
      fuel.value = ''
      update()
      search.focus()
    },{signal})
    const mobile = matchMedia('(max-width: 760px)')
    const syncFilterPanel = () => { controls.open = !mobile.matches }
    mobile.addEventListener('change', syncFilterPanel, {signal})
    syncFilterPanel()
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
    const preferredDate = form.elements.namedItem('preferred_date')
    if (preferredDate instanceof HTMLInputElement) preferredDate.min = todayInVietnam()
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
    const driveDrawer = form.closest<HTMLDialogElement>('#test-drive-drawer')
    if (model instanceof HTMLSelectElement) model.addEventListener('change', syncSelection, {signal})
    syncSelection()
    const status = form.querySelector<HTMLElement>('.form-status')!
    const button = form.querySelector<HTMLButtonElement>('button')!
    let retryKey:string|undefined
    if (driveDrawer && selection) {
      for (const trigger of document.querySelectorAll<HTMLButtonElement>('button[data-test-drive]')) {
        trigger.addEventListener('click',()=>{
          const options = trigger.dataset.testDrive==='vehicle-options'
            ? document.querySelector<HTMLFormElement>('[data-vehicle-options]')
            : null
          const selected = options && new FormData(options)
          const trim = form.elements.namedItem('trim')
          const color = form.elements.namedItem('color')
          if (!(trim instanceof HTMLInputElement) || !(color instanceof HTMLInputElement)) return
          const nextTrim = String(selected?.get('trim') ?? trigger.dataset.driveTrim ?? '')
          const nextColor = String(selected?.get('color') ?? trigger.dataset.driveColor ?? '')
          if (trim.value!==nextTrim || color.value!==nextColor) {
            retryKey=undefined
            status.textContent=''
          }
          trim.defaultValue=nextTrim
          color.defaultValue=nextColor
          trim.value=nextTrim
          color.value=nextColor
          selection.textContent=[nextTrim && 'Phiên bản: '+nextTrim,nextColor && 'Màu xe: '+nextColor].filter(Boolean).join(' · ')
          selection.hidden=!selection.textContent
          if (!driveDrawer.open) driveDrawer.showModal()
        },{signal})
      }
      driveDrawer.addEventListener('click',event=>{
        if (event.target!==driveDrawer) return
        const bounds=driveDrawer.getBoundingClientRect()
        if (event.clientX<bounds.left || event.clientX>bounds.right ||
            event.clientY<bounds.top || event.clientY>bounds.bottom) driveDrawer.close()
      },{signal})
    }
    form.addEventListener('input',()=>{retryKey=undefined},{signal})
    form.addEventListener('submit', async event=>{
      event.preventDefault()
      if (button.disabled) return
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
  if (form) {
    const original = cover && {src: cover.src, srcset: cover.getAttribute('srcset'), alt: cover.alt}
    const initialPreview = preview?.src
    const drawer = form.closest('dialog')
    const modelPicker = document.querySelector<HTMLDialogElement>('dialog#chon-mau-xe')
    const drawers = new Map([['#chon-phien-ban',drawer],['#chon-mau-xe',modelPicker]])
    const heroColors = document.querySelectorAll<HTMLAnchorElement>('[data-hero-color]')
    const pickerLinks = document.querySelectorAll<HTMLAnchorElement>('a[href="#chon-phien-ban"], a[href="#chon-mau-xe"]')
    for (const link of pickerLinks) {
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const target = drawers.get(link.hash)
        if (!target?.showModal) return
        event.preventDefault()
        target.showModal()
        const option = Array.from(form.querySelectorAll<HTMLInputElement>('input[name=color]'))
          .find(input => input.value === link.dataset.heroColor)
        option?.click()
      }, {signal})
    }
    const openFromHash = () => {
      const target = drawers.get(location.hash)
      if (target && !target.open) target.showModal()
    }
    window.addEventListener('hashchange', openFromHash, {signal})
    openFromHash()
    for (const target of drawers.values()) {
      target?.addEventListener('click', event => {
        if (event.target !== target) return
        const bounds = target.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) target.close()
      }, {signal})
    }
    const configurationLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-vehicle-configure]'),link=>({
      link,base:link.href,
    }))
    const params = new URLSearchParams(location.search)
    for (const input of form.querySelectorAll<HTMLInputElement>('input[type=radio]')) {
      if (input.value && input.value===params.get(input.name)) input.checked=true
    }
    const update = () => {
      const selection = new FormData(form)
      for (const {link,base} of configurationLinks) {
        const url = new URL(base)
        for (const name of ['trim','color']) {
          const value = selection.get(name)
          if (!url.searchParams.has(name) && typeof value==='string' && value) url.searchParams.set(name,value)
        }
        link.setAttribute('href',url.pathname+url.search)
      }
      const color = form.querySelector<HTMLInputElement>('input[name=color]:checked')
      for (const link of heroColors) {
        if (link.dataset.heroColor === color?.value) link.setAttribute('aria-current','true')
        else link.removeAttribute('aria-current')
      }
      const photo = color?.dataset.photo
      if (cover && original) {
        if (photo || !original.srcset) cover.removeAttribute('srcset')
        else cover.setAttribute('srcset', original.srcset)
        cover.src = photo || original.src
        cover.alt = photo ? original.alt + ' · ' + color?.value : original.alt
      }
      if (preview && initialPreview) {
        preview.src = photo || initialPreview
        preview.alt = cover?.alt || ''
      }
    }
    form.addEventListener('change', update, {signal})
    window.addEventListener('pageshow', update, {signal})
    update()
  }

}
{

  const numbers = document.querySelectorAll<HTMLElement>('[data-rolling-number]')
  if (numbers.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries=>{
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio<.5) continue
        entry.target.setAttribute('data-rolling-visible','')
        observer.unobserve(entry.target)
      }
    },{threshold:.5})
    numbers.forEach(number=>observer.observe(number))
    signal.addEventListener('abort',()=>observer.disconnect(),{once:true})
  }

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
