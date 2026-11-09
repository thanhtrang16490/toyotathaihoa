'use server'

import {redirect} from 'next/navigation'
import {dataRequest} from '../../supabase-data'
import {getAdmin} from './session'
import {leadStatuses} from './leads'

async function requireAdmin() {
  if (!await getAdmin()) redirect('/dang-nhap/')
}

function finish(tab: string, saved: boolean): never {
  redirect('/quan-tri/?' + new URLSearchParams({muc: tab, ketQua: saved ? 'da-luu' : 'loi'}))
}

export async function updateLead(form: FormData) {
  await requireAdmin()
  const id = form.get('id')
  const status = form.get('status')
  if (typeof id !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id) ||
      typeof status !== 'string' || !Object.hasOwn(leadStatuses, status)) finish('yeu-cau', false)

  const query = new URLSearchParams({id: 'eq.' + id, status: 'neq.test', select: 'id'})
  const response = await dataRequest('toyota_leads', query, 'server', {
    method: 'PATCH', body: JSON.stringify({status}),
  })
  finish('yeu-cau', Boolean(response && (await response.json()).length === 1))
}

function amount(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !/^\d{1,11}$/.test(value)) return null
  const number = Number(value)
  return number >= 1 && number <= 20_000_000_000 ? number : null
}

export async function updatePrice(form: FormData) {
  await requireAdmin()
  const id = form.get('id')
  const retail = amount(form.get('retail'))
  const hanoiField = form.get('hanoi')
  const hanoi = amount(hanoiField)
  const province10 = amount(form.get('province10'))
  const province12 = amount(form.get('province12'))
  const note = form.get('note')
  if (typeof id !== 'string' || !/^[a-z0-9-]{1,40}$/.test(id) ||
      retail === null || (hanoiField !== '' && hanoi === null) ||
      province10 === null || province12 === null || typeof note !== 'string' || note.length > 500) {
    finish('gia', false)
  }

  const query = new URLSearchParams({id: 'eq.' + id, select: 'id'})
  const response = await dataRequest('toyota_on_road_prices', query, 'server', {
    method: 'PATCH',
    body: JSON.stringify({retail,hanoi,province10,province12,note:note.trim() || null,published:form.get('published') === 'on'}),
  })
  finish('gia', Boolean(response && (await response.json()).length === 1))
}
