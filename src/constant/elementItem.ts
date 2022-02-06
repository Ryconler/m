export interface ElementItemType {
  id: number
  image: string
  groupTitle: string
  groupSubTitle: string
  maxNum: number
  minNum: number
  minSubNum: number
  maxSubNum: number
  title: string
  link: string
}

export interface ElementGroupType {
  id: number
  title: string
  subTitle: string
  elementInfo: ElementItemType[]
  elementNum: number
  allElementInfo?: ElementItemType[]
  headImage: string
  link: string
}
