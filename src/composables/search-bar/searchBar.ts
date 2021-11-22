import { getSearchBarConfig } from '@/api/searchBar'
import { SearchBarConfigType } from '@/constant/searchBar'
import { CityType, DefaultCity, getLocation, getSelectCity } from '@/utils'
import { onMounted, Ref, ref } from 'vue'

export function getSearchBarData() {
  const searchBarConfig: Ref<SearchBarConfigType> = ref({})
  const selectCity: Ref<CityType> = ref(DefaultCity)
  const searchValue = ref('')
  onMounted(async () => {
    selectCity.value = getSelectCity() || (await getLocation()) || DefaultCity
    searchBarConfig.value = (await getSearchBarConfig()) || {}
  })
  return {
    searchBarConfig,
    selectCity,
    searchValue
  }
}
