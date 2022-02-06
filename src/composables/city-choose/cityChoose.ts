import { queryAllCitys } from '@/api/cityChoose'
import { CityType, GroupedCitysCity } from '@/constant/cityChoose'
import { setSelectCity } from '@/utils'
import { groupBy } from 'lodash'
import { nextTick, onMounted, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'

export function getCityChooseData() {
  const route = useRoute()

  const groupedCitys: Ref<GroupedCitysCity> = ref({})
  const citysKeys: Ref<string[]> = ref([])
  onMounted(async () => {
    const allCitys: CityType[] = await queryAllCitys()
    groupedCitys.value = {}
    groupedCitys.value = groupBy(allCitys, (item) => {
      return item.PINYIN && item.PINYIN[0]
    })
    for (const citys of Object.values(groupedCitys.value)) {
      citys.sort((item1, item2) => {
        if (item1.PINYIN < item2.PINYIN) {
          return -1
        } else {
          return 1
        }
      })
    }
    citysKeys.value = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ]
    await nextTick()
    window.scrollTo(0, 1)
    window.scrollTo(0, 0)
  })

  const cityClick = (city: CityType) => {
    setSelectCity(city.ID, city.NAME)
    const referrer =
      route.query.referrer || document.referrer || '//m.wzmxx.com'
    location.href = decodeURIComponent(referrer.toString())
  }
  return {
    groupedCitys,
    citysKeys,
    cityClick
  }
}
