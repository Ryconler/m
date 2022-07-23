import { queryShareKey } from '@/api/common'
import { queryAllActivities, queryShareActivities } from '@/api/shareService'
import { FilterTypes } from '@/constant/classifySort'
import {
  ShareActivityType,
  ShareKeyLinkTypeRKHY,
  ShareKeyLinkTypeWorkChat,
  ShareKeyTokenWorkChat,
  ShareKeyToolType,
  TrackTerm
} from '@/constant/shareService'
import { CityType } from '@/types/city'
import { FilterDataType, StoreType } from '@/types/classifySort'
import { PositionType } from '@/types/position'
import { getMinicardUrl, replaceUrlKey } from '@/utils'
import { Toast } from 'vant'
import { computed, reactive, Ref, ref } from 'vue'

/* 活动模块列表 */
export const useShareActivities = (
  position: Ref<PositionType | null>,
  cityInfo: Ref<CityType>
) => {
  const activityList = reactive({
    list: <ShareActivityType[][]>[],
    loading: false,
    error: false,
    finished: false,
    load: async () => {
      try {
        const data = await queryShareActivities({
          ...filterData.value,
          cityCode: cityInfo.value.cityId,
          lat: position.value?.lat,
          lng: position.value?.lng
        })
        activityList.loading = false
        activityList.list.push(...data)
        activityList.finished = true
        if (stores.value.length == 0) {
          stores.value = data.map((item: ShareActivityType[]) => ({
            name: item[0].storeName,
            code: item[0].storeCode,
            selected: false
          }))
        }
      } catch (error) {
        activityList.loading = false
        activityList.error = true
      }
    }
  })
  const stores: Ref<StoreType[]> = ref([])
  const filterOptions = computed(() => {
    const options = [FilterTypes.Store]
    if (position.value) {
      options.push(FilterTypes.Distance)
    }
    return options
  })
  const filterInitData: Ref<FilterDataType> = ref({
    distanceSort: true
  })
  const filterData = ref(filterInitData.value)
  const filterChange = (newFilterData: FilterDataType) => {
    filterData.value = newFilterData
    activityList.list = []
    activityList.loading = true
    activityList.error = false
    activityList.finished = false
    activityList.load()
    activityMoreClicked.value = {}
  }
  const activityMoreClicked: Ref<{ [key: string]: boolean }> = ref({})
  const activityMoreClick = async (activities: ShareActivityType[]) => {
    const storeCode = activities[0].storeCode
    Toast.loading({
      forbidClick: true,
      duration: 0,
      message: '加载中...'
    })
    const allActivities = await queryAllActivities({ storeCode })
    Toast.clear()
    const moreActivities = allActivities.filter((item: ShareActivityType) => {
      return !activities.some(item2 => item2.activityId == item.activityId)
    })
    activities.push(...moreActivities)
    activityMoreClicked.value[storeCode] = true
  }
  return {
    activityList,
    stores,
    filterOptions,
    filterInitData,
    filterChange,
    activityMoreClicked,
    activityMoreClick
  }
}

export const useActivityInfo = (cityInfo: Ref<CityType>) => {
  const activityLink = (activity: ShareActivityType) => {
    return `https://w.cekid.com/interaction-activity/detail/${activity.activityId}`
  }
  const storeLink = (store: { storeCode: string; storeName: string }) => {
    return `https://w.cekid.com/interaction-activity/storeactlist/?entityid=${
      store.storeCode
    }&entityname=${encodeURIComponent(store.storeName)}&cityid=${
      cityInfo.value.cityId
    }&cityname=${cityInfo.value.cityName}`
  }
  const activityClick = async (activity: ShareActivityType) => {
    location.href = activityLink(activity) + '?kwtarget=blank'
  }
  const storeClick = async (store: {
    storeCode: string
    storeName: string
  }) => {
    location.href = storeLink(store) + '&kwtarget=blank'
  }

  return {
    activityLink,
    storeLink,
    storeClick,
    activityClick
  }
}

export const useActivityShare = (cityInfo: Ref<CityType>) => {
  const { activityLink } = useActivityInfo(cityInfo)
  const activityShare = async (e: Event, activity: ShareActivityType) => {
    e.stopPropagation()
    Toast.loading({
      forbidClick: true,
      duration: 0,
      message: '加载中...'
    })
    const shareTitle = activity.activeTheme
    const shareRemark = JSON.stringify({
      toolType: ShareKeyToolType,
      url: activityLink(activity)
    })
    const shareMinicard =
      (await getMinicardUrl(
        activity.coverPhotoUrl,
        Number(activity.activitySkuPrice)
      )) || activity.coverPhotoUrl
    const sharePosterimg = activity.coverPhotoUrl
    Toast('分享成功')
  }
  return {
    activityShare
  }
}
