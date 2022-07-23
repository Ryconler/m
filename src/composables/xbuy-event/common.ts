import { participateEvent } from '@/api/xbuyEvent'
import { EventType } from '@/constant/xbuyEvent'
import jsCookie from 'js-cookie'
import qs from 'query-string'
import { Toast } from 'vant'

export const toShare = async () => {
  Toast('请在App或小程序中打开页面进行分享')
}

/* 跳订单确认页，复制商详逻辑 */
export const goPurchase = (eventInfo: EventType, skuDetail: any) => {
  location.href = '/'
}

export const goOrder = (eventInfo: EventType) => {
  location.href = `/`
}

export const reParticipate = async (eventInfo: EventType) => {
  await participateEvent(eventInfo.id, eventInfo.skuId)
  location.replace(`/xbuy-event/${eventInfo.id}?skuId=${eventInfo.skuId}`)
}

export const metooParticipate = (eventInfo: EventType) => {
  location.replace(`/xbuy-event/${eventInfo.id}?skuId=${eventInfo.skuId}`)
}
