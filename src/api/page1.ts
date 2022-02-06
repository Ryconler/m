import { urlPrefixes } from '@/constant/urlPrefixes'
import {
  Page1ConfigType,
  Page1DataType,
  Page1MinElementType,
  Page1GroupType
} from '@/constant/page1'
import {
  ajax,
  getLocation,
  http,
  lHttp,
  LocationType,
  ResultType
} from '@/utils'
import qs from 'query-string'

const api = {
  queryPage1Config: `${urlPrefixes.mockApi}/queryPage1Config`,
  queryContents: `${urlPrefixes.mockApi}/queryContents`,
  queryGroups: `${urlPrefixes.mockApi}/queryGroups`,
  getMinElement: `${urlPrefixes.mockApi}/getMinElement`
}

export async function queryPage1Config() {
  try {
    const result: ResultType<Page1ConfigType> = await ajax.get(
      `${api.queryPage1Config}`
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

export async function queryContents() {
  try {
    const result: ResultType<Page1DataType> = await lHttp.post(
      `${api.queryContents}`,
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

export async function queryGroups() {
  try {
    const location: LocationType | null = await getLocation()
    const params = {
      cityCode: '320100',
      lng: location ? location.lng : '',
      lat: location ? location.lat : ''
    }
    const result: ResultType<Page1GroupType[]> = await http.get(
      `${api.queryGroups}?${qs.stringify(params)}`
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

export async function getMinElement(id?: number) {
  try {
    const params = {
      cityId: '320100',
      id
    }
    const result: ResultType<Page1MinElementType> = await lHttp.get(
      `${api.getMinElement}?${qs.stringify(params)}`
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
