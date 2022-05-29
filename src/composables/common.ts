import { DefaultCity } from '@/constant/city'
import { CookieKeys } from '@/constant/storage'
import { getPosition, getSelectCity, setSelectCity } from '@/utils'
import jsCookie from 'js-cookie'
import { CityType } from 'types/city'
import { PositionType } from 'types/position'
import { onMounted, Ref, ref } from 'vue'

/* 获取选择城市、定位等信息 */
export const getLocation = () => {
  const position: Ref<PositionType | null> = ref(null)
  const cityInfo: Ref<CityType> = ref(DefaultCity)
  const locationLoaded = ref(false) //选择城市与定位是否均获取完毕，可判断是否可以开始需要传参城市与定位的请求
  onMounted(async () => {
    const cookieCity = jsCookie.get(CookieKeys.City)
    /* 1、优先取公共城市选择页的city */
    if (cookieCity) {
      const iNList = cookieCity.split('_')
      cityInfo.value = {
        cityId: iNList[0],
        cityName: decodeURIComponent(iNList[1])
      }
    } else {
      /* 2、没有继续取服务前端的city_service */
      const cookieCityService = await getSelectCity()
      if (cookieCityService != null) {
        cityInfo.value = cookieCityService
      } else {
        /* 3、再没有取定位城市 */
        position.value = await getPosition()
        if (position.value != null) {
          cityInfo.value = {
            cityId: position.value.cityId,
            cityName: position.value.cityName
          }
        } else {
          /* 4、定位也取不到取默认南京 */
          cityInfo.value = DefaultCity
        }
      }
    }
    // 将服务前端的city_service保持同步
    setSelectCity(cityInfo.value.cityId, cityInfo.value.cityName)
    if (position.value == null) {
      // 上面的操作没有用到定位时，异步获取定位，不影响titlebar的城市显示
      getPosition().then(data => {
        position.value = data
        locationLoaded.value = true
      })
    } else {
      locationLoaded.value = true
    }
  })
  return { position, cityInfo, locationLoaded }
}
