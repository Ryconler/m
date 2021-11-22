<template>
  <VanSwipe class="banners" :autoplay="5000" :show-indicators="false">
    <VanSwipeItem
      v-for="(item, index) in banners"
      :key="index"
      @click="bannerClick(item, index)"
    >
      <ImgHzw :src="item.img" width="750" height="148" />
    </VanSwipeItem>
  </VanSwipe>
</template>
<script lang="ts" setup>
import { getCurrentInstance, PropType } from 'vue'
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant'
import { PhotoBannerType } from '@/constant/photography'

defineProps({
  banners: {
    type: Array as PropType<PhotoBannerType[]>,
    default() {
      return []
    }
  }
})

const internalInstance = getCurrentInstance()
const bannerClick = (banner: PhotoBannerType, index: number) => {
  internalInstance &&
    internalInstance.appContext.config.globalProperties.$trackClick({
      bizType: '127',
      pageLevelId: '121013214',
      clickId: '200001',
      positionId: `${index}`
    })
  if (banner.link) {
    location.href = banner.link
  }
}
</script>
<style lang="scss" scoped>
.banners {
  height: 148px;
}
</style>
