<template>
  <div class="tabs">
    <VanTabs
      v-model:active="selectedTab"
      class="sticky-fix"
      style="--fix-bg: #ffffff"
      title-active-color="#ff5900"
      :swipe-threshold="4"
      :ellipsis="false"
      border
      scrollspy
      sticky
    >
      <VanTab
        v-for="(item, index) in showTabs"
        :key="item.level4Category"
        :title="item.level4Category"
      >
        <TabsContent
          class="tabs-content-wrap"
          :show-tab-name="index > 0"
          :tabname="item.level4Category"
          :themes="item.themes"
          :elements="item.elementInfo"
          @theme-pic-click="showThemeDetail"
        ></TabsContent>
      </VanTab>
      <VanTab v-if="groups && groups.length > 0" title="拍摄门店">
        <TabsGroups :groups="groups"></TabsGroups>
      </VanTab>
    </VanTabs>
    <!-- 主题详情 -->
    <VanImagePreview.Component
      id="image-preview"
      v-model:show="themeDetailShow"
      :images="themeDetailImages"
      :start-position="selectedThemeImageStart"
      :close-on-popstate="false"
      teleport="body"
      @change="themeDetailImageChange"
    >
      <template #index>
        <span class="pf-medium">{{ themeDetailImageIndex + 1 }}</span>
        <span class="pf-medium gray">/{{ themeDetailImages.length }}</span>
      </template>
      <template #cover>
        <!-- 主题商品显示 -->
        <template v-if="themeDetailElement">
          <ElementCell :element="themeDetailElement"></ElementCell>
          <div class="menu_wkBox_back_box"></div>
        </template>
      </template>
    </VanImagePreview.Component>
  </div>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import {
  Tabs as VanTabs,
  Tab as VanTab,
  ImagePreview as VanImagePreview
} from 'vant'
import TabsContent from './Page1TabsContent.vue'
import TabsGroups from './Page1TabsGroups.vue'
import { Page1ContentType, Page1GroupType } from '@/constant/page1'
import { getTabs, getThemeDetail } from '@/composables/page1/page1Tabs'

const props = defineProps({
  tabs: {
    type: Array as PropType<Page1ContentType[]>,
    default() {
      return []
    }
  },
  groups: {
    type: Array as PropType<Page1GroupType[]>,
    default() {
      return []
    }
  }
})

const { selectedTab, showTabs } = getTabs(props)

const {
  selectedThemeImageStart,
  themeDetailShow,
  themeDetailImages,
  showThemeDetail,
  themeDetailImageIndex,
  themeDetailImageChange,
  themeDetailElement
} = getThemeDetail()
</script>
<style lang="scss" scoped>
.tabs {
  .van-tabs > :deep(div) {
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
            right: 1px;
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
  .van-tabs > :deep(.van-tabs__content) {
    .van-tab__pane:not(:first-child) {
      .tabs-content-wrap .theme:first-child {
        .theme-title {
          padding-top: 20px;
        }
      }
    }
    .van-tab__pane:not(:first-child) {
      padding-top: 20px;
    }
  }
}
</style>
<style lang="scss">
#image-preview {
  display: flex;
  flex-direction: column;
  height: auto;
  bottom: 0;
  .van-image-preview__swipe {
    height: auto;
    flex: 1;
    .van-image-preview__image {
      // 图片详情动态添加
      .image-detail {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        .theme-title {
          height: 168px;
          padding: 101px 24px 31px;
          box-sizing: border-box;
          background-image: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.13) 24%,
            rgba(0, 0, 0, 0.8)
          );
          font-size: 30px;
          color: #ffffff;
          line-height: 36px;
          @include ellicpsis;
        }
      }
    }
    .van-image-preview__image.van-image-preview__image--vertical {
      img {
        width: auto;
      }
    }
  }
  .van-image-preview__index {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    transform: none;
    line-height: initial;
    text-shadow: none;
    text-align: center;
    height: 88px;
    line-height: 88px;
    font-size: 36px;
    color: #ffffff;
    .gray {
      color: #999999;
    }
  }
  .van-image-preview__cover {
    position: relative;
    background: #ffffff;
  }
}
</style>
