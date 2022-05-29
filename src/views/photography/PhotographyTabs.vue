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
          :products="item.cmmdtyInfo"
          @theme-pic-click="showThemeDetail"
        ></TabsContent>
      </VanTab>
      <VanTab v-if="stores && stores.length > 0" title="拍摄门店">
        <TabsStores :stores="stores"></TabsStores>
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
        <template v-if="themeDetailProduct">
          <ProductCell :product-info="themeDetailProduct"></ProductCell>
          <div class="menu_wkBox_back_box"></div>
        </template>
      </template>
    </VanImagePreview.Component>
  </div>
</template>
<script lang="ts" setup>
import {
  nextTick,
  PropType,
  computed,
  getCurrentInstance,
  Ref,
  ref,
  toRefs,
  watch,
  watchEffect
} from 'vue'
import {
  Tabs as VanTabs,
  Tab as VanTab,
  ImagePreview as VanImagePreview
} from 'vant'
import TabsContent from './PhotographyTabsContent.vue'
import TabsStores from './PhotographyTabsStores.vue'
import { getMinPriceSpu } from '@/api/photography'

const props = defineProps({
  tabs: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  },
  stores: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  }
})

const getProductGiveNegatives = (product: any) => {
  try {
    if (product && product.photoItem) {
      const items: any[] = JSON.parse(product.photoItem)
      const maxItem = items.reduce((item1, item2) => {
        if (item1.isGiveNegatives == undefined) {
          return item2
        } else if (item2.isGiveNegatives == undefined) {
          return item1
        } else {
          return item1.isGiveNegatives > item2.isGiveNegatives ? item1 : item2
        }
      }, {})
      return maxItem.isGiveNegatives
    } else {
      return undefined
    }
  } catch (e) {
    return undefined
  }
}

const { selectedTab, showTabs } = ((props: any) => {
  // 商品顺序调整，整体顺序不变的同时底片全送推荐在前
  function sortProducts(products: any[]) {
    let i = 0
    for (const index in products) {
      const product = products[index]
      if (getProductGiveNegatives(product) == '1') {
        if (Number(index) > i) {
          products.splice(Number(index), 1)
          products.splice(i, 0, product)
        }
        i++
      }
    }
  }

  const { tabs } = toRefs(props)
  const selectedTab = ref(0) //所选tab
  const showTabs: Ref<any[]> = computed(() => {
    // 过滤无商品tab
    return tabs.value.filter((item: any) => {
      if (item.cmmdtyInfo && item.cmmdtyInfo.length > 0) {
        sortProducts(item.cmmdtyInfo)
        return true
      } else {
        return false
      }
    })
  })
  return { selectedTab, showTabs }
})(props)

const {
  selectedThemeImageStart,
  themeDetailShow,
  themeDetailImages,
  showThemeDetail,
  themeDetailImageIndex,
  themeDetailImageChange,
  themeDetailProduct
} = (() => {
  /* 在每张图片上创建图片详情 */
  function refreshImageDetail() {
    nextTick(() => {
      const swipeDoms = document.querySelectorAll(
        '#image-preview .van-swipe-item'
      )
      swipeDoms.forEach((item: Element, index: number) => {
        const detailDomText = selectedThemeImages.value[index].detailDomText
        const imageDom = item.querySelector('.van-image-preview__image')
        const exist = imageDom && imageDom.querySelector('.image-detail')
        if (detailDomText && imageDom && !exist) {
          try {
            const detailDom = new DOMParser().parseFromString(
              detailDomText,
              'text/html'
            ).body.childNodes[0]
            const imageDetail = document.createElement('div')
            imageDetail.className = 'image-detail'
            imageDetail.appendChild(detailDom)
            imageDom.appendChild(imageDetail)
          } catch (e) {
            console.error('添加图片详情失败', e)
          }
        }
      })
    })
  }
  /* 删除旧的图片详情DOM */
  function deleteImageDetail() {
    const doms = document.querySelectorAll('#image-preview  .image-detail')
    doms.forEach((item: Element) => {
      item.remove()
    })
  }

  const selectedTheme: Ref<any> = ref(null) //所选主题
  const selectedThemeImages: Ref<any[]> = computed(() => {
    const theme = selectedTheme.value
    if (theme && theme.themePics) {
      return theme.themePics.map((item: any) => {
        return {
          imgUrl: item,
          detailDomText: `<div class="theme-title pf-medium">${theme.themeName}</div>` //每张图片上面需要显示的图片详情
        }
      })
    } else {
      return []
    }
  }) //所选主题图片
  const selectedThemeImageStart = ref(0) //所选主题图片索引
  const themeDetailShow = ref(false) //是否显示主题详情
  watch(themeDetailShow, () => {
    if (themeDetailShow.value) {
      setTimeout(() => {
        refreshImageDetail()
      }, 200)
    } else {
      deleteImageDetail()
    }
  })
  const themeDetailImages = computed(() => {
    return selectedThemeImages.value.map(item => item.imgUrl)
  })
  const themeDetailImageIndex = ref(0)
  const themeDetailImageChange = (index: number) => {
    themeDetailImageIndex.value = index
    refreshImageDetail()
  }
  const showThemeDetail = (theme: any, picIndex: number) => {
    selectedTheme.value = theme
    selectedThemeImageStart.value = picIndex
    themeDetailImageIndex.value = picIndex
    themeDetailShow.value = true
  }
  const themeDetailProduct: Ref<any | null> = ref(null)
  watchEffect(async () => {
    const themeId = selectedTheme.value && selectedTheme.value.themeId
    if (themeId) {
      themeDetailProduct.value = await getMinPriceSpu(themeId)
    }
  })
  return {
    selectedThemeImageStart,
    themeDetailShow,
    themeDetailImages,
    showThemeDetail,
    themeDetailImageIndex,
    themeDetailImageChange,
    themeDetailProduct
  }
})()
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
            /* prettier-ignore */
            right: 1Px;
            transform: translateY(-50%);
            /* prettier-ignore */
            width: 1Px;
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
