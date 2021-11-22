export interface PhotoConfigType {
  brand?: string
  flow?: string
}

export interface PhotoDataType {
  ads?: PhotoBannerType[]
  content?: PhotoContentType[]
}
export interface PhotoBannerType {
  img: string
  link: string
}
export interface PhotoContentType {
  level4Category: string
  cmmdtyInfo: PhotoContentProductType[]
  themes: PhotoContentThemeType[]
}
export interface PhotoContentProductType {
  spuId: number
  spuName: string
  cmmdtyImage: string
  photoItem: string
  minPrice: number
  templateType2Id: number
  businessId: number
}
export interface PhotoContentThemeType {
  themeId?: number
  themeName?: string
  themePics?: string[]
  themeStyles?: string[]
}

export interface PhotoStoreType {
  addressStreet: string
  businessId: number
  distance: number
  shortName: string
  storeId: number
}

export interface PhotoMinProductType {
  spuId?: number
  spuName?: string
  photoNum?: number
  photeRepairNum?: number
  price?: number
  templateType2Id?: number
  businessId?: number
}
