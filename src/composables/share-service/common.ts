import { queryShareConfig } from '@/api/shareService'
import {
  ShareConfigAdType,
  ShareConfigBannerType,
  ShareSpuItemType
} from '@/constant/shareEarn'
import { CityType } from '@/types/city'
import { rem2RealPx } from '@/utils'
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  Ref
} from 'vue'
import { useStore } from 'vuex'

export const useOffsetTop = () => {
  const classifySortOffsetTop = computed(() => {
    const tabHeight = rem2RealPx(84 / 75)
    return tabHeight
  })

  const classifySortStickyDistance = computed(() => {
    const taskDom = document.querySelector('.share-service-task-comp')
    const bannerDom = document.querySelector('.share-service-banner')
    const titleBarDom = document.querySelector('.title-bar')
    const taskHeight = taskDom ? taskDom.getBoundingClientRect().height : 0
    const bannerHeight = bannerDom
      ? bannerDom.getBoundingClientRect().height
      : 0
    const titleBarHeight = titleBarDom
      ? titleBarDom.getBoundingClientRect().height
      : 0
    return taskHeight + bannerHeight + titleBarHeight
  })
  return { classifySortOffsetTop, classifySortStickyDistance }
}

export const useShareMain = (cityInfo: Ref<CityType>) => {
  const store = useStore()
  const internalInstance = getCurrentInstance()

  const banners: Ref<ShareConfigBannerType[]> = ref([])
  const ads: Ref<ShareConfigAdType[]> = ref([])
  const recommendSpus: Ref<ShareSpuItemType[]> = ref([])
  onMounted(async () => {
    const shareConfig = await queryShareConfig(cityInfo.value.cityId)
    banners.value = shareConfig.adsList || []
    ads.value = shareConfig.cmsList || []
    recommendSpus.value = shareConfig.spuList || []
    recommendSpus.value.forEach(item => {
      item.storeName = item.storeName || item.businessName
    })
    nextTick(() => {
      const mainDom = document.querySelector('.share-main')
      const mainHeight = mainDom ? mainDom.getBoundingClientRect().height : 0
    })
  })

  const bannerClick = (banner: ShareConfigBannerType) => {
    if (banner.link) {
      location.href = <string>banner.link
    }
  }
  const adIndex = ref(0)
  const adClick = () => {
    if (ads.value[adIndex.value].link) {
      location.href = <string>ads.value[adIndex.value].link
    }
  }
  const adChange = (index: number) => {
    adIndex.value = index
  }
  return {
    banners,
    bannerClick,
    ads,
    adIndex,
    adClick,
    adChange,
    recommendSpus
  }
}
