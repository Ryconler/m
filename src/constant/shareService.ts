// 素材类型:1海报,2保险海报,3图片,4视频
export enum MaterialType {
  Poster = 1,
  BxPoster,
  Image,
  Video
}
export const MaterialTypeText = {
  [MaterialType.Poster]: '带码海报',
  [MaterialType.BxPoster]: '保险海报',
  [MaterialType.Image]: '图片',
  [MaterialType.Video]: '视频'
}
//业务类型:1孕产,2成长加,3自营服务,4活动,5保险
export enum ShareTaskBusinessType {
  Yunchan = 1,
  Chengzhangjia,
  Ziying,
  Huodong,
  Baoxian
}
export type ShareMaterialType = {
  materialType: MaterialType
  picUrl: string
  shareLink?: string //海报分享链接
  spuId?: number //保险商品编码
}
export type ShareTaskType = Partial<{
  businessType: ShareTaskBusinessType
  detailLink: string
  endTime: string
  id: number
  shareArticle: string
  shareMaterialList: ShareMaterialType[]
  sharePeople: string
  title: string
}>

export type ShareSpuType = Partial<{
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
}>

export type ShareActivityType = {
  activeTheme: string
  activityId: number
  activitySkuPrice: string
  activityState: string
  activityTimeEnd: number
  activityTimeStart: number
  activityTimeStartFormat: string
  coverPhotoUrl: string
  entryTimeEnd: number
  entryTimeStart: number
  isBlack: string
  isPay: string
  limitCount: number
  newUserSign: number
  payWay: number
  serverTime: number
  signInCount: number
  signState: string
  signUpCount: number
  storeCode: string
  storeName: string
  storePhotoUrl: string
}

export type ShareInsuranceType = {
  abbr: string
  imageUrl: string
  name: string
  subTitle: string
  itemId: number
  salePriceMin: number
  salePriceMax: number
  redirectUrl: string
  shareIntegrationUrl: string
  recomInfo: string
  recomType: 1 | 2 //佣金类型（1：单值 2：区间）
}

export type InsuranceEarnDetailType = Partial<{
  dataList: string[][]
  titleList: string[]
}>

export const ShareKeyLinkTypeWorkChat = import.meta.env
  .VITE_SHARE_SERVICE_LINK_TYPE_WORKCHAT // 分享key的linktype 云客服务-企微场景
export const ShareKeyLinkTypeRKHY = import.meta.env
  .VITE_SHARE_SERVICE_LINK_TYPE_RKHY // 分享key的linktype 云客服务-人客场景
export const ShareKeyTokenWorkChat = import.meta.env
  .VITE_SHARE_SERVICE_TOKEN_WORKCHAT // 分享key的token 云客服务-企微场景
export const ShareKeyTokenRKHY = import.meta.env.VITE_SHARE_SERVICE_TOKEN_RKHY // 分享key的token 云客服务-人客场景
export const ShareKeyToolType = 401 // 分享key的remark.toolType 服务分享赚
/* 分享渠道 */
export enum ShareUTM {
  GroupChat = 1, //企微群 1
  SingleChat, //企微好友 2
  ExternalMoment, //企微朋友圈 3
  ExternalChat, //企微群群发 4
  ExternalContact, //企微好友群发 5
  Yunke //云客 6
}
/* 埋点上报终端筛选 */
export enum TrackTerm {
  Qiwei = 'qiwei',
  Rkhy = 'rkhy'
}

/* 商品分享素材 */
export type SpuMaterialType = {
  sku_info?: {
    name: string
    lowest_price: number
    highest_price: number
    main_pic: string
  }
  material_info?: {
    pic: {
      start_time: number
      end_time: number
      content: {
        url: string
      }[]
    }[]
    video: {
      start_time: number
      end_time: number
      content: {
        cover: string
        url: string
        duration: number
      }
    }[]
    poster: {
      start_time: number
      end_time: number
      content: {
        url: string
      }[]
    }[]
    copy_writing: ''
  }
}
