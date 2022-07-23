export declare type CategorysType = {
  title: string
  list: CategoryType[]
}
export declare type CategoryType = {
  title: string
  categoryId: string
  selected?: boolean
}

export interface DistrictType {
  id?: string
  name: string
  selected?: boolean
}

export declare type FilterDataType = {
  [key: string]: any //索引签名
  level4CategoryId?: string[]
  distanceSort?: boolean
  shareAmountSort?: boolean
  storeFavPersonNumSort?: boolean
  shareGoodsOnly?: number
}

export declare type StoreType = {
  code?: string
  name: string
  selected?: boolean
}
