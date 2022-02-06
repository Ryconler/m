import { queryHomeConfig } from '@/api/home'
import { ElementItemType } from '@/constant/elementItem'
import { HomeAdType, HomeBannerType } from '@/constant/home'
import { CityType } from '@/utils'
import { nextTick, onMounted, Ref, ref } from 'vue'
import { useStore } from 'vuex'

export const getHomeMain = (cityInfo: Ref<CityType>) => {
  const store = useStore()

  const banners: Ref<HomeBannerType[]> = ref([])
  const ads: Ref<HomeAdType[]> = ref([])
  const recommendElements: Ref<ElementItemType[]> = ref([])
  onMounted(async () => {
    const homeConfig = await queryHomeConfig(cityInfo.value.cityId)
    banners.value = homeConfig.banners || []
    ads.value = homeConfig.ads || []
    recommendElements.value = homeConfig.elements || []
    nextTick(() => {
      const mainDom = document.querySelector('.home-main')
      const mainHeight = mainDom ? mainDom.getBoundingClientRect().height : 0
      store.commit('home/setMainHeight', mainHeight)
    })
  })

  const bannerClick = (banner: HomeBannerType) => {
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
    recommendElements
  }
}
