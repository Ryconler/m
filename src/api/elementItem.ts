import { urlPrefixes } from '@/constant/urlPrefixes'
import qs from 'query-string'
import { ajax, http, ResultType } from '@/utils'
import jsCookie from 'js-cookie'

const api = {
  checkElement: `${urlPrefixes.cloudbaseApi}/checkElement`,
  uncheckElement: `${urlPrefixes.cloudbaseApi}/uncheckElement`
}

export async function checkElement(id: number) {
  try {
    const param = JSON.stringify({
      uid: jsCookie.get('uid'),
      id
    })
    const result: ResultType<null> = await http.post(
      api.checkElement,
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

export async function uncheckElement(id: number) {
  try {
    const param = JSON.stringify({
      uid: jsCookie.get('uid'),
      spuIds: [id]
    })
    const result: ResultType<null> = await ajax.post(
      api.uncheckElement,
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
