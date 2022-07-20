import qs from 'query-string'
import { ajax, http } from '@/utils'
import urlPrefixes from '@/constant/urlPrefixes'
import { ResultType } from '@/types/http'
import jsCookie from 'js-cookie'

const api = {
  queryEventInfo: `${urlPrefixes.spromotionapi}/spromotion-api/xpurchase/getXPurchaseDetail.do`,
  participateEvent: `${urlPrefixes.spromotionapi}/spromotion-api/xpurchase/addXPurchase.do`,
  helpEvent: `${urlPrefixes.spromotionapi}/spromotion-api/xpurchase/assistance.do`
}

export async function queryEventInfo(eventId: number, skuId: number) {
  try {
    const result: ResultType<any> = await http.get(
      `${api.queryEventInfo}?activityId=${eventId}&skuId=${skuId}`
    )
    const { data, code } = result
    if (+code === 1) {
      return data || {}
    } else {
      return {}
    }
  } catch (e) {
    return {}
  }
}

export async function participateEvent(eventId: number, skuId: number) {
  const param = {
    uid: jsCookie.get('uid'),
    skey: jsCookie.get('skey'),
    activityId: eventId,
    skuId
  }
  const result: ResultType<null> = await ajax.post(
    api.participateEvent,
    qs.stringify(param),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }
  )
  const { code, msg } = result
  if (code != 1) {
    return msg
  }
}

// 助力
export async function helpEvent(
  eventId: number,
  skuId: number,
  shareUid: number | string
) {
  try {
    const query = qs.stringify({
      uid: jsCookie.get('uid'),
      skey: jsCookie.get('skey'),
      activityId: eventId,
      skuId,
      shareUid
    })
    const result: ResultType<null> = await ajax.get(`${api.helpEvent}?${query}`)
    const { code, msg } = result
    return { code, msg }
  } catch (e) {
    return {}
  }
}
