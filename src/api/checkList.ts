import { urlPrefixes } from '@/constant/urlPrefixes'
import { ajax, ResultType } from '@/utils'
import jsCookie from 'js-cookie'

const api = {
  queryCheckedElements: `${urlPrefixes.mockApi}/queryCheckedElements`
}

export async function queryCheckedElements() {
  try {
    const result: ResultType<any> = await ajax.get(
      `${api.queryCheckedElements}?uid=${jsCookie.get('uid')}`
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
