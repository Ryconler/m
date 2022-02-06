<template>
  <VanSwipe class="banners" :autoplay="5000" :show-indicators="false">
    <VanSwipeItem
      v-for="(item, index) in banners"
      :key="index"
      @click="bannerClick(item)"
    >
      <BaseImg :src="item.img" height="148" />
    </VanSwipeItem>
  </VanSwipe>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant'
import { Page1BannerType } from '@/constant/page1'

defineProps({
  banners: {
    type: Array as PropType<Page1BannerType[]>,
    default() {
      return []
    }
  }
})

const bannerClick = (banner: Page1BannerType) => {
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
