<template>
  <div class="photography">
    <div v-if="photographyConfig.brand" class="brand-wrap">
      <img :src="photographyConfig.brand" />
    </div>
    <Banners
      v-if="photographyData.ads && photographyData.ads.length > 0"
      class="banners-wrap"
      :banners="photographyData.ads"
    />
    <Tabs
      v-if="photographyData.content && photographyData.content.length > 0"
      class="tabs-wrap"
      :tabs="photographyData.content"
      :stores="photographyStores"
    />
    <div v-if="photographyConfig.flow" class="flow-wrap">
      <img :src="photographyConfig.flow" />
    </div>
    <div class="menu_wkBox_back_box"></div>
  </div>
</template>
<script lang="ts" setup>
import {
  getPhotographyConfig,
  getPhotographyInfo,
  getPhotographyStores
} from '@/api/photography'
import { onMounted, provide, Ref, ref } from 'vue'
import Banners from './PhotographyBanners.vue'
import Tabs from './PhotographyTabs.vue'

const photographyConfig: Ref<any> = ref({})
const photographyData: Ref<any> = ref({})
const photographyStores: Ref<any[]> = ref([])
onMounted(async () => {
  photographyConfig.value = await getPhotographyConfig()
  getPhotographyInfo().then(data => {
    photographyData.value = data
  })
  getPhotographyStores().then(data => {
    photographyStores.value = data
  })
})

provide('photographyConfig', photographyConfig)
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
    margin-bottom: 8px;
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
