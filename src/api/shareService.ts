import urlPrefixes from '@/constant/urlPrefixes'
import { ajax, http } from '@/utils'
import jsCookie from 'js-cookie'
import qs from 'query-string'
import { ResultType } from 'types/http'

const api = {
  queryShareTask: `${urlPrefixes.soperationapi}/soperation-api/shareTask/queryShareTaskByCity.do`,
  queryShareSpus: `${urlPrefixes.svsesapi}/queryAggregate.do`,
  queryShareInsurances: `${urlPrefixes.xingbeibaoxianapi}/insp/channel/item/list`,
  getInsuranceEarnDetail: `${urlPrefixes.xingbeibaoxianapi}/insrw/item/recomRateDetail.do`
}

export async function queryShareTask(cityId: string | number): Promise<{
  rotationPicList?: { rotationPic: string; jumpUrl: string }[]
  shareTaskList?: any[]
}> {
  try {
    // http://mytest.kapi.haiziwang.com:3003/project/1692/interface/api/45781
    const result: ResultType<{
      rotationPicList: { rotationPic: string; jumpUrl: string }[]
      shareTaskList: any[]
    }> = await ajax.get(`${api.queryShareTask}?cityId=${cityId}`)
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

export async function queryShareSpus(params: any) {
  try {
    // http://mytest.kapi.haiziwang.com:3003/project/1786/interface/api/26279
    const result: ResultType<any> = await ajax.post(api.queryShareSpus, params)
    const { data, code, msg } = result
    if (+code === 1) {
      return data || {}
    } else {
      throw msg
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function queryShareInsurances(): Promise<{
  ItemList: any[]
}> {
  try {
    const uid = jsCookie.get('uid')
    const skey = jsCookie.get('skey')
    const param = qs.stringify({
      uid,
      skey,
      channelKey: 'kw-yk'
    })
    const result: ResultType<{ ItemList: any[] }> = await http.get(
      `${api.queryShareInsurances}?${param}`
    )
    const { data, code, msg } = result
    if (+code === 1001) {
      return data || {}
    } else {
      throw msg
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

/* 查询保险佣金明细 */
export async function getInsuranceEarnDetail(itemId: number) {
  try {
    const uid = jsCookie.get('uid')
    const skey = jsCookie.get('skey')
    const param = qs.stringify({
      uid,
      skey,
      itemId,
      partnerId: '1'
    })
    const result: ResultType<any> = await http.get(
      `${api.getInsuranceEarnDetail}?${param}`
    )
    const { data, code } = result
    if (+code === 1001) {
      return data || {}
    }
    return {}
  } catch (e) {
    return {}
  }
}
