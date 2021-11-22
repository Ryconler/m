<template>
  <div class="photography">
    <div class="brand-wrap">
      <img :src="photographyConfig.brand || DefaultBrand" />
    </div>
    <Banners class="banners-wrap" :banners="photographyData.ads" />
    <Tabs
      v-if="photographyData.content && photographyData.content.length > 0"
      class="tabs-wrap"
      :tabs="photographyData.content"
      :stores="photographyStores"
    />
    <div v-if="photographyConfig.flow" class="flow-wrap">
      <img :src="photographyConfig.flow" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import DefaultBrand from '@/assets/images/photography/bg-brand.png'
import { getPhotographyData } from '@/composables/photography/photography'
import Banners from './PhotographyBanners.vue'
import Tabs from './PhotographyTabs.vue'

const { photographyConfig, photographyData, photographyStores } =
  getPhotographyData()
</script>
<style lang="scss" scoped>
.photography {
  & :deep(img) {
    pointer-events: none;
  }
  .brand-wrap {
    margin-bottom: 10px;
    img {
      width: 750px;
      height: auto;
      display: block;
    }
  }
  .banners-wrap {
    margin-bottom: 20px;
  }
  .tabs-wrap {
    margin-bottom: 16px;
  }
  .flow-wrap {
    img {
      width: 750px;
      height: auto;
      display: block;
    }
  }
}
</style>
