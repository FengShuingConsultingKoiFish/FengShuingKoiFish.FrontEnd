// src/types/interfaces.ts

export interface KoiDetail {
  koiDetailId: number
  koiBreedName: string
  koiName: string
  koiCategoryId?: number
  koiBreedId?: number
  colors?: string
  pattern?: string
  description?: string
  image?: string
}

export interface PondDetail {
  pondDetailId: number
  pondName: string
  pondId?: number
  description?: string
  image?: string
}

export interface PondInfo {
  id: number
  quantity: number
  pondName: string
}

export interface PondCharacteristic {
  id: number
  pondCategoryId: number
  name: string
  description: string
  image: string
}

export interface BreedInfo {
  id: number
  name: string
  colors?: string
  pattern?: string
  description?: string
  image?: string
}
