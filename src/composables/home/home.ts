import { queryDistricts } from '@/api/common'
import { DistrictType } from '@/constant/classifySort'
import {
  CityType,
  DefaultCity,
  getLocation,
  getSelectCity,
  LocationType,
  setSelectCity
} from '@/utils'
import { nextTick, onMounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export const getLocationData = () => {
  const store = useStore()

  const location: Ref<LocationType | null> = ref(null)
  const cityInfo: Ref<CityType> = ref(DefaultCity)
  const districts: Ref<DistrictType[]> = ref([])
  const locationLoaded = ref(false)
  onMounted(async () => {
    location.value = await getLocation()
    const cookieCity = getSelectCity()
    if (cookieCity) {
      cityInfo.value = cookieCity
    } else {
      if (location.value != null) {
        cityInfo.value = {
          cityId: location.value.cityId,
          cityName: location.value.cityName
        }
      } else {
        cityInfo.value = DefaultCity
      }
      setSelectCity(cityInfo.value.cityId, cityInfo.value.cityName)
    }
    locationLoaded.value = true
    nextTick(() => {
      const titleBarDom = document.querySelector('.title-bar-wrap')
      const titleBarHeight = titleBarDom
        ? titleBarDom.getBoundingClientRect().height
        : 0
      store.commit('home/setTitleBarHeight', titleBarHeight)
    })

    const districtList = await queryDistricts(cityInfo.value.cityId)
    districts.value = districtList.map((item: any) => {
      return {
        id: item.ID,
        name: item.NAME
      }
    })
  })
  return { location, cityInfo, districts, locationLoaded }
}

export const getAvatar = () => {
  const router = useRouter()
  const avatarClick = () => {
    router.push({
      name: 'checkList'
    })
  }
  return { avatarClick }
}
