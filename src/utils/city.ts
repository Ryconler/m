import jsCookie from 'js-cookie'
import { COOKIE_KEYS } from '@/constant/storage'

export interface CityType {
  cityId: string
  cityName: string
}

export const DefaultCity: CityType = {
  cityName: '南京',
  cityId: '320100'
}

export function getSelectCity(): CityType | null {
  const selectCity = jsCookie.get(COOKIE_KEYS.CITY) || ''
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
  jsCookie.set(COOKIE_KEYS.CITY, `${citycode}_${cityName}`)
}
