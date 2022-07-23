import urlPrefixes from '@/constant/urlPrefixes'
import { ajax, http } from '@/utils'
import jsCookie from 'js-cookie'
import qs from 'query-string'
import { ResultType } from '@/types/http'
import { SpuMaterialType } from '@/constant/shareService'

const api = {
  queryShareTask: `${urlPrefixes.mockApi}/soperation-api/shareTask/queryShareTaskByCity.do`,
  queryShareSpus: `${urlPrefixes.mockApi}/queryAggregate.do`,
  queryShareActivities: `${urlPrefixes.mockApi}/ias-web/ifsia/activityListForTab.do`,
  queryAllActivities: `${urlPrefixes.mockApi}/ias-web/ifsia/activityListForApp.do`,
  queryShareInsurances: `${urlPrefixes.mockApi}/insp/channel/item/list`
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

export async function queryShareActivities(params: {
  cityCode: string | number
  storeCode?: string
  lat?: string
  lng?: string
}) {
  try {
    const param = JSON.stringify(params)
    const result: ResultType<any> = await http.get(
      `${api.queryShareActivities}?param=${param}`
    )
    const { data, code, msg } = result
    if (code == '1') {
      return (data && data.list) || []
    } else {
      throw msg
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function queryAllActivities(params: { storeCode: string }) {
  try {
    const param = JSON.stringify(params)
    const result: ResultType<any> = await http.get(
      `${api.queryAllActivities}?param=${param}`
    )
    const { data, code } = result
    if (code == '1') {
      return (data && data.list) || []
    } else {
      return []
    }
  } catch (e) {
    console.error(e)
    return []
  }
}
