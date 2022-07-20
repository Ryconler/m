import jsCookie from 'js-cookie'
import { CookieKeys } from '@/constant/storage'
import { CityType } from '@/types/city'

export function getSelectCity(): CityType | null {
  const selectCity = jsCookie.get(CookieKeys.City) || ''
  const cityId = selectCity.split('_')[0]
  const cityName = selectCity.split('_')[1]
  if (cityId && cityName) {
    return {
      cityId,
      cityName
    }
  } else {
    return null
  }
}

export function setSelectCity(citycode: string, cityName: string) {
  jsCookie.set(CookieKeys.City, `${citycode}_${cityName}`)
}
