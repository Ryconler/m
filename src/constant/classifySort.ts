import { CategorysType } from '@/types/classifySort'

export const CategoryAll: CategorysType = {
  title: '全部',
  list: [
    {
      title: '全部',
      categoryId: ''
    }
  ]
}

export const FilterTypes = {
  Category: 'category', //品类筛选
  Distance: 'distance', //距离排序
  Earn: 'earn', //佣金排序
  Sale: 'sale', //销量排序
  Good: 'good', //好评排序
  Earnonly: 'earnOnly' //过滤无分享赚
}
