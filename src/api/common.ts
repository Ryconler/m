import { urlPrefixes } from '@/constant/urlPrefixes'
import { ajax } from '@/utils'

const api = {
  queryDistricts: `${urlPrefixes.mockApi}/getDistricts`,
  checkUserExist: `${urlPrefixes.cloudbaseApi}/checkUserExist`
}

export async function queryDistricts(cityId: number | string) {
  try {
    const result: any = await ajax.get(`${api.queryDistricts}?cityId=${cityId}`)
    const { DistrictList } = result
    return DistrictList || []
  } catch (e) {
    return []
  }
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
