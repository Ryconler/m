import { urlPrefixes } from '@/constant/urlPrefixes'
import { ajax, ResultType } from '@/utils'

const api = {
  queryAllCitys: `${urlPrefixes.mockApi}/queryAllCitys`
}

export async function queryAllCitys() {
  try {
    const result: ResultType<any> = await ajax.get(`${api.queryAllCitys}`)
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
