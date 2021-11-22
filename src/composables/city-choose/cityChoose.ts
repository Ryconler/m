import { CityType } from '@/utils'
import { computed, Ref, ref } from 'vue'

export function getCityChooseData() {
  const listCitys: Ref<any> = ref({
    N: [{ cityName: '南京', cityId: '320100' }],
    S: [
      { cityName: '上海', cityId: '310100' },
      { cityName: '上海', cityId: '310100' }
    ]
  })
  const historyCitys: Ref<CityType[]> = ref([
    { cityName: '南京', cityId: '320100' },
    { cityName: '上海', cityId: '310100' }
  ])
  const hotCitys: Ref<CityType[]> = ref([
    { cityName: '南京', cityId: '320100' },
    { cityName: '上海', cityId: '310100' }
  ])
  const listCitysKeys: Ref<string[]> = computed(() => {
    return Object.keys(listCitys.value).sort()
  })
  return {
    listCitys,
    historyCitys,
    hotCitys,
    listCitysKeys
  }
}
