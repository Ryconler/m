import {
  PhotoConfigType,
  PhotoDataType,
  PhotoMinProductType,
  PhotoStoreType
} from '@/constant/photography'
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
  getPhotographyConfig: `https://cms.cekid.com/publish/999/photography-config.json`,
  getPhotographyInfo: `https://svsesapi.haiziwang.com/svses-api/api/querySelfPhoto.do`,
  getPhotographyStores: `http://scbapi.cekid.com/scb-api/store/selfPhotographyStoreList.do`,
  getMinPriceSpu: `https://sccapi.cekid.com/scc-api/api/spu/queryMinPriceSpuByTheme.do`
}

export async function getPhotographyConfig() {
  const result: ResultType<PhotoConfigType> = await ajax.get(
    `${api.getPhotographyConfig}`
  )
  const { data, code, msg } = result
  if (+code === 0) {
    return data
  } else {
    return Promise.reject(msg)
  }
}

export async function getPhotographyInfo() {
  const result: ResultType<PhotoDataType> = await lHttp.post(
    `${api.getPhotographyInfo}`,
    {
      // cityId: getSelectedCityId(),
      cityId: '320100',
      level3CategoryId: [101215]
    }
  )
  const { data, code, msg } = result
  if (+code === 1) {
    return data
  } else {
    return Promise.reject(msg)
  }
}

export async function getPhotographyStores() {
  const position: LocationType | null = await getLocation()
  const params = {
    cityCode: '320100',
    lng: position ? position.lng : '',
    lat: position ? position.lat : ''
  }
  const result: ResultType<PhotoStoreType[]> = await http.get(
    `${api.getPhotographyStores}?${qs.stringify(params)}`
  )
  const { data, code, msg } = result
  if (+code === 1) {
    return data
  } else {
    return Promise.reject(msg)
  }
}

export async function getMinPriceSpu(themeId?: number) {
  const params = {
    cityId: '320100',
    themeId
  }
  const result: ResultType<PhotoMinProductType> = await lHttp.get(
    `${api.getMinPriceSpu}?${qs.stringify(params)}`
  )
  const { data, code, msg } = result
  if (+code === 1) {
    return data
  } else {
    return Promise.reject(msg)
  }
}
