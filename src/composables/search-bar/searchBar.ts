import { getSearchBarConfig } from '@/api/searchBar'
import { SearchBarConfigType } from '@/constant/searchBar'
import {
  CityType,
  DefaultCity,
  getLocation,
  getSelectCity,
  setSelectCity
} from '@/utils'
import { onMounted, Ref, ref } from 'vue'

export function getSearchBarData() {
  const selectCity: Ref<CityType> = ref(DefaultCity)
  const searchValue = ref('')
  onMounted(async () => {
    const cookieCity = getSelectCity()
    if (cookieCity) {
      selectCity.value = cookieCity
    } else {
      const location = await getLocation()
      if (location != null) {
        selectCity.value = {
          cityId: location.cityId,
          cityName: location.cityName
        }
      } else {
        selectCity.value = DefaultCity
      }
      setSelectCity(selectCity.value.cityId, selectCity.value.cityName)
    }
  })
  return {
    selectCity,
    searchValue
  }
}
