export interface ShareConfigBannerType {
  img?: string
  link?: string
}
export interface ShareConfigAdType {
  title?: string
  link?: string
}

export interface ShareBusiItemType {
  businessId: number
  businessType: number
  distance: string
  isSpot: number
  spuInfo: ShareSpuItemType[]
  spuNum: number
  allSpuInfo?: ShareSpuItemType[]
  storeHeadImg: string
  storeId: number
  storeName: string
}

export interface ShareSpuItemType {
  businessId: number
  businessName: string
  cmmdtyImage: string
  distance: string
  maxPrice: number
  minPrice: number
  minOrginPrice: number
  price: number
  promotions: string
  ratio: string //分享赚信息
  minSaleRate: number
  maxSaleRate: number
  saleNum: number
  spuId: number
  spuName: string
  storeName: string
  templateType2Id: number
  level4CategoryId: number
  materialFlag: number
}

export interface ShareListItemType {
  businessId: number
  businessName: string
  cmmdtyImage: string
  maxPrice: number
  maxSaleRate: number
  minPrice: number
  minSaleRate: number
  skuid: number
  spuId: string
  spuName: string
}

export const ShareKeyToolType = 401 // 分享key的remark.toolType 服务分享赚
