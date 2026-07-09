import { supabase } from './supabase'

/* Sync profile to Supabase — non-blocking */
export function syncProfile(email: string, data: Record<string, unknown>) {
  supabase.from('perfiles').upsert({ email, ...data, updated_at: new Date().toISOString() })
    .then(() => {}).catch(() => {})
}

/* Sync full products array for a user — delete + reinsert */
export function syncProducts(email: string, products: Record<string, unknown>[]) {
  supabase.from('productos').delete().eq('user_email', email).then(() => {
    if (!products.length) return
    supabase.from('productos').insert(
      products.map(p => ({
        id: p.id,
        user_email: email,
        name: p.name,
        category: p.category,
        price: p.price,
        unit: p.unit,
        min_order: p.minOrder,
        description: p.desc,
        origin: p.origin || '',
        photos: p.photos || [],
        cert_docs: p.certDocs || [],
        created_at: new Date().toISOString(),
      }))
    ).then(() => {}).catch(() => {})
  }).catch(() => {})
}

/* Sync awards */
export function syncAwards(email: string, awards: Record<string, unknown>[]) {
  supabase.from('premios').delete().eq('user_email', email).then(() => {
    if (!awards.length) return
    supabase.from('premios').insert(
      awards.map(a => ({
        id: a.id,
        user_email: email,
        name: a.name,
        year: a.year,
        org: a.org,
        description: a.desc,
        photo: a.photo || null,
        created_at: new Date().toISOString(),
      }))
    ).then(() => {}).catch(() => {})
  }).catch(() => {})
}

/* Sync story */
export function syncStory(email: string, story: Record<string, unknown>) {
  supabase.from('historia').upsert({ email, ...story, updated_at: new Date().toISOString() })
    .then(() => {}).catch(() => {})
}
