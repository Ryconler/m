import { urlPrefixes } from '@/constant/urlPrefixes'
import { ajax, http, ResultType } from '@/utils'

const api = {
  queryHomeConfig: `${urlPrefixes.mockApi}/queryHomeConfig`,
  queryHomeList: `${urlPrefixes.cloudbaseApi}/queryAggregate`,
  queryAllElements: `${urlPrefixes.mockApi}/queryElements`
}

export async function queryHomeConfig(cityId: number | string) {
  try {
    const result: ResultType<any> = await http.get(
      `${api.queryHomeConfig}?cityId=${cityId}`
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

export async function queryHomeList(params: any) {
  try {
    const result: ResultType<any> = await ajax.post(api.queryHomeList, params)
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

export async function queryAllElements(params: any) {
  try {
    const result: ResultType<any> = await ajax.post(
      api.queryAllElements,
      params
    )
    const { data, code } = result
    if (+code === 1) {
      return data || {}
    } else {
      return {}
    }
  } catch (e: any) {
    return {}
  }
}
