import urlPrefixes from '@/constant/urlPrefixes'
import { ajax } from '@/utils'

const api = {
  checkUserExist: `${urlPrefixes.cloudbaseApi}/checkUserExist`
}

export async function checkUserExist(phoneNumber: string) {
  try {
    const result: any = await ajax.get(
      `${api.checkUserExist}?phoneNumber=${phoneNumber}`
    )
    const { code } = result
    return code == '1'
  } catch (e) {
    return false
  }
}
