import urlPrefixes from '@/constant/urlPrefixes'
import { ResultType } from '@/types/http'
import { PositionType } from '@/types/position'
import { ajax, getPosition, http } from '@/utils'
import qs from 'query-string'

const api = {
  getPhotographyConfig: `${urlPrefixes.cms999}/photography-config.json`,
  getPhotographyInfo: `${urlPrefixes.svsesapi}/querySelfPhoto.do`,
  getPhotographyStores: `${urlPrefixes.scbapi}/store/selfPhotographyStoreList.do`,
  getMinPriceSpu: `${urlPrefixes.sccapi}/api/spu/queryMinPriceSpuByTheme.do`
}

export async function getPhotographyConfig() {
  try {
    const result: ResultType<any> = await ajax.get(
      `${api.getPhotographyConfig}`
    )
    const { data, code } = result
    if (+code === 0) {
      return data || {}
    } else {
      return {}
    }
  } catch (e) {
    return {}
  }
}

export async function getPhotographyInfo() {
  try {
    const result: ResultType<any> = await http.post(
      `${api.getPhotographyInfo}`,
      {
        cityId: '320100',
        level3CategoryId: [101215]
      }
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

export async function getPhotographyStores() {
  try {
    const position: PositionType | null = await getPosition()
    const params = {
      cityCode: '320100',
      lng: position ? position.lng : '',
      lat: position ? position.lat : ''
    }
    const result: ResultType<any[]> = await http.get(
      `${api.getPhotographyStores}?${qs.stringify(params)}`
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

export async function getMinPriceSpu(themeId?: number) {
  try {
    const params = {
      // cityId: getSelectedCityId(),
      cityId: '320100',
      themeId
    }
    const result: ResultType<any> = await http.get(
      `${api.getMinPriceSpu}?${qs.stringify(params)}`
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
