export type Lang = 'es' | 'en'

export type ProductCategory =
  | 'bebidas'
  | 'agricultura'
  | 'artesanias'
  | 'cosmeticos'
  | 'farmaceutico'

export type Certification =
  | 'denominacion-origen'
  | 'organico'
  | 'senasica'
  | 'nom'
  | 'cofepris'
  | 'kosher-halal'

export type MexicanState =
  | 'Jalisco'
  | 'Oaxaca'
  | 'Chiapas'
  | 'Puebla'
  | 'Veracruz'
  | 'Yucatán'
  | 'Guerrero'
  | 'Michoacán'
  | 'Sonora'
  | 'Guanajuato'

export interface Producer {
  id: string
  name: string
  state: MexicanState
  category: ProductCategory
  description: string
  verified: boolean
  founded: number
  employees: string
  certifications: Certification[]
  exportCountries: string[]
  logo: string // emoji placeholder
  rating: number
  totalProducts: number
}

export interface Product {
  id: string
  name: string
  nameEn: string
  category: ProductCategory
  producerId: string
  producerName: string
  state: MexicanState
  price: number
  currency: 'USD'
  unit: string
  unitEn: string
  moq: number
  moqUnit: string
  certifications: Certification[]
  verified: boolean
  icon: string
  description: string
  descriptionEn: string
  inStock: boolean
  trending?: boolean
  newProduct?: boolean
}

export interface FilterState {
  search: string
  category: ProductCategory | ''
  certifications: Certification[]
  state: MexicanState | ''
  sort: 'relevancia' | 'recientes' | 'menor-precio' | 'mayor-demanda' | 'verificados'
}
