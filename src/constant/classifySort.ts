export const CategoryAll: CategorysType = {
  title: '全部',
  categoryId: '',
  list: [
    {
      title: '全部',
      categoryId: '',
      list: []
    }
  ]
}

export interface CategorysType {
  title: string
  categoryId: string
  list: CategoryType[]
}
export interface CategoryType {
  title: string
  categoryId: string
  list: []
}

export const DistrictAll: DistrictType = {
  name: '全城',
  id: undefined
}

export interface DistrictType {
  id?: string
  name: string
}

export interface FilterDataType {
  [key: string]: any //索引签名
  level4CategoryId?: string[]
  districtId?: string
  distanceSort?: boolean
  shareAmountSort?: boolean
  storeFavPersonNumSort?: boolean
  shareGoodsOnly?: number
}

export const FilterTypes = {
  CATEGORY: 'category', //品类筛选
  DISTRICT: 'district', //城区筛选
  DISTANCE: 'subTitle', //距离排序
  EARN: 'earn', //佣金排序
  SALE: 'sale', //销量排序
  GOOD: 'good', //好评排序
  EARNONLY: 'earnOnly' //过滤无分享赚
}
