import {load} from 'cheerio'
export function cleanImportedPage(entry) {
  const $ = load(entry.html, undefined, false)
  $('#delivery_info_wrapper, #shipping_info_wrapper, #composition_info_wrapper, a[href="#delivery_info_wrapper"], a[href="#shipping_info_wrapper"], a[href="#composition_info_wrapper"]').remove()
  $('a[href="/dich-vu-dong-son-toyota/"]').each((_, link) => {
    if (/^bảo hiểm$/i.test($(link).text().trim())) $(link).attr('href', '/bao-hiem-toyota/')
  })
  entry.html = $.root().html() || ''
  entry.description = entry.description.replace(/\s*(?:…|\.\.\.)?\s*Continue reading\b.*/is, '').trim()
  return entry
}
