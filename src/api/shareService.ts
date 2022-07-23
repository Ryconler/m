import urlPrefixes from '@/constant/urlPrefixes'
import { ajax, http } from '@/utils'
import jsCookie from 'js-cookie'
import qs from 'query-string'
import { ResultType } from '@/types/http'
import { SpuMaterialType } from '@/constant/shareService'

const api = {
  queryShareConfig: `${urlPrefixes.soperationapi}/soperation-api/shareApi/queryShareSpu.do`,
  queryShareTask: `${urlPrefixes.soperationapi}/soperation-api/shareTask/queryShareTaskByCity.do`,
  queryShareSpus: `${urlPrefixes.svsesapi}/queryAggregate.do`,
  queryShareActivities: `${urlPrefixes.iasapi}/ias-web/ifsia/activityListForTab.do`,
  queryAllActivities: `${urlPrefixes.iasapi}/ias-web/ifsia/activityListForApp.do`,
  queryShareInsurances: `${urlPrefixes.xingbeibaoxianapi}/insp/channel/item/list`,
  getInsuranceEarnDetail: `${urlPrefixes.xingbeibaoxianapi}/insrw/item/recomRateDetail.do`,
  getRecruitInfo: `${urlPrefixes.scbapi}/business/getRecruitInfo.do`,
  reportShareLog: `${urlPrefixes.soperationapi}/soperation-api/shareTask/shareLogRecord.do`,
  querySpuMaterial: `${urlPrefixes.materialapi}/shequn-material/web/c/v1/getMaterialInfo`
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

/* 查询登录用户是否为赚呗店主 */
export async function getRecruitInfo() {
  try {
    const uid = jsCookie.get('uid')
    const result: ResultType<{ shopkeeper: number }> = await http.get(
      `${api.getRecruitInfo}?uid=${uid}`
    )
    const { data, code } = result
    if (code == '1') {
      return data.shopkeeper || 0
    }
    return 0
  } catch (e) {
    return 0
  }
}

/* 上报分享任务日志记录 */
export async function reportShareLog(params: {
  taskId?: number
  utmList: string
  shareKey: string
}) {
  const { taskId, utmList, shareKey } = params
  const empId = jsCookie.get('empId')
  const param = qs.stringify({
    taskId,
    utmList,
    shareKey,
    sharePeople: empId
  })
  await http.get(`${api.reportShareLog}?${param}`)
}

/* 查询商品关联素材 */
export async function querySpuMaterial(
  spuId: number,
  skuId?: number
): Promise<SpuMaterialType> {
  try {
    const query = qs.stringify({
      sku_id: skuId,
      spu_id: skuId ? undefined : spuId, //有skuId就仅传skuId，不传spuId
      product_type: 2,
      material_type: 0
    })
    // http://testkapi.haiziwang.com/project/2851/interface/api/48025
    const result: ResultType<SpuMaterialType> = await http.get(
      `${api.querySpuMaterial}?${query}`
    )
    const { data, code } = result
    if (+code == 1001) {
      return data || {}
    } else {
      return {}
    }
  } catch (e) {
    return {}
  }
}

export async function queryShareConfig(cityId: number | string) {
  try {
    const result: ResultType<any> = await http.get(
      `${api.queryShareConfig}?cityId=${cityId}`
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
