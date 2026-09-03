import { supabase } from './supabase'

/* Sync profile to Supabase — updates both perfiles and usuarios tables */
export function syncProfile(email: string, data: Record<string, unknown>) {
  supabase.from('perfiles').upsert({ email, ...data, updated_at: new Date().toISOString() })
    .then(() => {}).catch(() => {})
  const usuariosFields: Record<string, unknown> = {}
  if (data.name)     usuariosFields.name     = data.name
  if (data.company)  usuariosFields.company  = data.company
  if (data.location) usuariosFields.state    = data.location
  if (data.category) usuariosFields.category = data.category
  if (Object.keys(usuariosFields).length > 0) {
    supabase.from('usuarios').update(usuariosFields).eq('email', email)
      .then(() => {}).catch(() => {})
  }
}

/* Sync buyer profile to Supabase */
export function syncBuyerProfile(email: string, data: Record<string, unknown>) {
  supabase.from('perfiles').upsert({ email, ...data, updated_at: new Date().toISOString() })
    .then(() => {}).catch(() => {})
  const usuariosFields: Record<string, unknown> = {}
  if (data.country)   usuariosFields.country  = data.country
  if (data.industry)  usuariosFields.category = data.industry
  if (data.interests) usuariosFields.interest = data.interests
  if (data.name)      usuariosFields.name     = data.name
  if (data.company)   usuariosFields.company  = data.company
  if (Object.keys(usuariosFields).length > 0) {
    supabase.from('usuarios').update(usuariosFields).eq('email', email)
      .then(() => {}).catch(() => {})
  }
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
        name_translations: p.name_translations || {},
        description_translations: p.description_translations || {},
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
        desc_translations: a.desc_translations || {},
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
