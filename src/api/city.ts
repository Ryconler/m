import urlPrefixes from '@/constant/urlPrefixes'
import { ajax } from '@/utils'
import { getAllCityListResultType } from '@/types/city'
import { ResultType } from '@/types/http'

const api = {
  getAllCityList: `${urlPrefixes.mapi}/city/getAllCityList`
}

export async function getAllCityList(): Promise<getAllCityListResultType[]> {
  try {
    const result: ResultType<getAllCityListResultType[]> = await ajax.get(
      `${api.getAllCityList}`
    )
    const { data, code } = result
    if (code == 1) {
      return data || []
    } else {
      return []
    }
  } catch (e) {
    return []
  }
}