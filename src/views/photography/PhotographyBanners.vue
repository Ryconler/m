<template>
  <VanSwipe class="banners" :autoplay="5000" :show-indicators="false">
    <VanSwipeItem
      v-for="(item, index) in banners"
      :key="index"
      @click="bannerClick(item, index)"
    >
      <BaseImg :src="item.img" width="750" height="148" />
    </VanSwipeItem>
  </VanSwipe>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  banners: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  }
})

const bannerClick = (banner: any, index: number) => {
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
