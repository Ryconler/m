<template>
  <div class="tabs">
    <VanTabs
      ref="tabs"
      v-model:active="tabsSelected"
      title-active-color="#ff5900"
      :swipe-threshold="4"
      :ellipsis="false"
      border
      scrollspy
      sticky
      @click-tab="tabClick"
    >
      <VanTab
        v-for="item in tabs"
        :key="item.level4Category"
        :title="item.level4Category"
      >
        <TabsContent
          class="tabs-content-wrap"
          :tabname="item.level4Category"
          :themes="item.themes"
          :products="item.cmmdtyInfo"
          @theme-pic-click="showThemeDetail"
        ></TabsContent>
      </VanTab>
      <VanTab v-if="stores && stores.length > 0" title="拍摄门店">
        <TabsStores class="tabs-stores-wrap" :stores="stores"></TabsStores>
      </VanTab>
    </VanTabs>
    <!-- 主题详情 -->
    <ThemeDetail
      v-model:show="themeDetailShow"
      class="theme-detail-wrap"
      :start-position="themePicIndex"
      :theme="themeDetail"
    ></ThemeDetail>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, PropType, Ref, ref } from 'vue'
import { Tabs as VanTabs, Tab as VanTab } from 'vant'
import TabsContent from './PhotographyTabsContent.vue'
import TabsStores from './PhotographyTabsStores.vue'
import ThemeDetail from './PhotographyThemeDetail.vue'
import {
  PhotoContentThemeType,
  PhotoContentType,
  PhotoStoreType
} from '@/constant/photography'

defineProps({
  tabs: {
    type: Array as PropType<PhotoContentType[]>,
    default() {
      return []
    }
  },
  stores: {
    type: Array as PropType<PhotoStoreType[]>,
    default() {
      return []
    }
  }
})

const internalInstance = getCurrentInstance()
const tabsSelected = ref(0)
const themeDetail: Ref<PhotoContentThemeType> = ref({})
const themeDetailShow = ref(false)
const themePicIndex = ref(0)
const showThemeDetail = (theme: PhotoContentThemeType, picIndex: number) => {
  themeDetail.value = theme
  themeDetailShow.value = true
  themePicIndex.value = picIndex
}
const tabClick = ({ title }: any) => {
  internalInstance &&
    internalInstance.appContext.config.globalProperties.$trackClick({
      bizType: '127',
      pageLevelId: '121013214',
      clickId: '200002',
      positionParam: {
        tabname: title
      }
    })
}
</script>
<style lang="scss" scoped>
.tabs {
  & > :deep(div) {
    .van-sticky {
      .van-tabs__wrap {
        height: 88px;
        &[class*='van-hairline']::after {
          border-top: none;
        }
        .van-tabs__nav {
          background: transparent;
          padding: 0;
          .van-tab {
            padding: 0 24px;
            .van-tab__text {
              font-size: 32px;
              font-weight: 500;
              line-height: 1;
            }
          }
          .van-tab:not(:nth-last-of-type(2))::after {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: 1px;
            height: 30px;
            background: #dedede;
            border-radius: 2px;
          }
          .van-tab.van-tab--active {
            .van-tab__text {
              font-weight: 600;
            }
          }
          .van-tabs__line {
            width: 28px;
            height: 6px;
            background-image: linear-gradient(243deg, #ff5900 5%, #ff8800 100%);
            border-radius: 3px;
            bottom: 12px;
          }
        }
      }
    }
    .van-sticky--fixed {
      .van-tabs__wrap {
        .van-tabs__nav {
          background: #ffffff;
        }
      }
    }
  }
  .tabs-content-wrap {
    margin-bottom: 20px;
  }
  .tabs-stores-wrap {
  }
}
</style>
