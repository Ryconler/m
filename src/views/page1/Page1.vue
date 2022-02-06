<template>
  <div class="page1">
    <div v-if="page1Config.brand" class="brand-wrap">
      <img :src="page1Config.brand" />
    </div>
    <Banners
      v-if="page1Data.banners && page1Data.banners.length > 0"
      class="banners-wrap"
      :banners="page1Data.banners"
    />
    <Tabs
      v-if="page1Data.content && page1Data.content.length > 0"
      class="tabs-wrap"
      :tabs="page1Data.content"
      :groups="page1Groups"
    />
    <div v-if="page1Config.flow" class="flow-wrap">
      <img :src="page1Config.flow" />
    </div>
    <div class="menu_wkBox_back_box"></div>
  </div>
</template>
<script lang="ts" setup>
import { provide } from 'vue'
import { getPage1Data } from '@/composables/page1/page1'
import Banners from './Page1Banners.vue'
import Tabs from './Page1Tabs.vue'

const { page1Config, page1Data, page1Groups } = getPage1Data()

provide('page1Config', page1Config)
</script>
<style lang="scss" scoped>
.page1 {
  & :deep(img) {
    pointer-events: none;
  }
  .brand-wrap {
    img {
      display: block;
      width: 100%;
      height: auto;
      max-height: 750px;
      object-fit: cover;
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
