import urlPrefixes from '@/constant/urlPrefixes'
import qs from 'query-string'
import { ajax, http } from '@/utils'
import { ResultType } from 'types/http'
import jsCookie from 'js-cookie'

const api = {
  queryShareConfig: `${urlPrefixes.soperationapi}/soperation-api/shareApi/queryShareSpu.do`,
  queryShareList: `${urlPrefixes.svsesapi}/queryAggregate.do`,
  queryAllSpus: `${urlPrefixes.svsesapi}/queryCommodity.do`,
  querySpuCheckList: `${urlPrefixes.sccapi}/fchild/worker/querySpuChecklists.do`,
  addSpuCheckList: `${urlPrefixes.sccapi}/fchild/worker/addSpuChecklist.do`, // 清单列表添加商品'
  delSpuCheckList: `${urlPrefixes.sccapi}/fchild/worker/deleteChecklistBySpuId.do` // 删除清单列表的商品'
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

export async function queryShareList(params: any) {
  try {
    // http://mytest.kapi.haiziwang.com:3003/project/1786/interface/api/26279
    const result: ResultType<any> = await ajax.post(api.queryShareList, params)
    const { data, code, msg } = result
    if (+code === 1) {
      return data || {}
    } else {
      throw msg
    }
  } catch (e: any) {
    throw e.message
  }
}

export async function queryAllSpus(params: any) {
  try {
    const result: ResultType<any> = await ajax.post(api.queryAllSpus, params)
    const { data, code, msg } = result
    if (+code === 1) {
      return data || {}
    } else {
      throw msg
    }
  } catch (e: any) {
    throw e.message
  }
}

export async function querySpuCheckList() {
  try {
    const result: ResultType<any> = await ajax.get(
      `${api.querySpuCheckList}?uid=${jsCookie.get('uid')}`
    )
    const { data, code } = result
    if (+code === 1) {
      return data || []
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}

export async function addSpuCheckList(spuId: number) {
  try {
    const param = JSON.stringify({
      uid: jsCookie.get('uid'),
      spuId
    })
    const result: ResultType<null> = await ajax.post(
      api.addSpuCheckList,
      qs.stringify({ param }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    )
    const { code } = result
    return code
  } catch (e) {
    return '0'
  }
}

// 删除清单列表的商品
export async function delSpuCheckList(spuId: number) {
  try {
    const param = JSON.stringify({
      uid: jsCookie.get('uid'),
      spuIds: [spuId]
    })
    const result: ResultType<null> = await ajax.post(
      api.delSpuCheckList,
      qs.stringify({ param }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    )
    const { code } = result
    return code
  } catch (e) {
    return '0'
  }
}
