<template>
  <div class="tabs-content">
    <div class="themes">
      <div v-for="item in themes" :key="item.themeId" class="theme">
        <div class="theme-title pf-medium">
          <span
            >{{ item.themeName }}（{{
              item.themePics ? item.themePics.length : 0
            }}）</span
          >
          <i
            v-for="(item, index) in item.themeStyles"
            :key="index"
            class="theme-style"
            >#{{ item }}</i
          >
        </div>
        <div class="theme-pics">
          <ImgHzw
            v-for="(item2, index2) in item.themePics"
            :key="index2"
            class="theme-pic"
            width="210"
            height="280"
            :src="item2"
            @click="themePicClick(item, index2)"
          />
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="products">
      <div class="products-title pf-medium">套餐推荐</div>
      <a
        v-for="item in products"
        :key="item.spuId"
        class="product"
        :href="getProductUrl(item)"
        @click="productClick(item)"
      >
        <BaseImg
          class="product-image"
          width="120"
          height="120"
          :src="item.cmmdtyImage"
        />
        <div class="product-info">
          <div class="product-title">{{ item.spuName }}</div>
          <div v-if="getPhotonumText(item.photoItem)" class="product-photonum">
            {{ getPhotonumText(item.photoItem) }}
          </div>
          <ProductPrice :price="item.minPrice" />
        </div>
        <div class="product-btn pf-medium">查看详情</div>
      </a>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, PropType, toRefs } from 'vue'
import {
  getPhotonumText,
  getProductUrl
} from '@/composables/photography/photographyTabsContent'
import {
  PhotoContentProductType,
  PhotoContentThemeType
} from '@/constant/photography'

const props = defineProps({
  tabname: {
    type: String,
    default: ''
  },
  themes: {
    type: Array as PropType<PhotoContentThemeType[]>,
    default() {
      return []
    }
  },
  products: {
    type: Array as PropType<PhotoContentProductType[]>,
    default() {
      return []
    }
  }
})

const emit = defineEmits(['theme-pic-click'])

const internalInstance = getCurrentInstance()
const { tabname } = toRefs(props)
const themePicClick = (theme: PhotoContentThemeType, picIndex: number) => {
  internalInstance &&
    internalInstance.appContext.config.globalProperties.$trackClick({
      bizType: '127',
      pageLevelId: '121013214',
      clickId: '200003',
      positionParam: {
        tabname: tabname.value,
        name: theme.themeName
      }
    })
  emit('theme-pic-click', theme, picIndex)
}

const productClick = (product: PhotoContentProductType) => {
  internalInstance &&
    internalInstance.appContext.config.globalProperties.$trackClick({
      bizType: '127',
      pageLevelId: '121013214',
      clickId: '200004',
      positionParam: {
        spuid: product.spuId
      }
    })
}
</script>
<style lang="scss" scoped>
.tabs-content {
  background: linear-gradient(180deg, #fff7f4, #ffffff 21%, #ffffff);
  .themes {
    overflow: hidden;
    .theme {
      &:last-child {
        margin-bottom: 40px;
      }
      .theme-title {
        padding: 40px 24px 0;
        margin-bottom: 24px;
        font-size: 30px;
        line-height: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        overflow: hidden;
        white-space: nowrap;
        .theme-style {
          margin-left: 8px;
          padding: 4px;
          border-radius: 4px;
          background: #fff2eb;
          color: #ff8800;
          font-size: 20px;
        }
      }
      .theme-pics {
        display: flex;
        overflow-x: auto;
        .theme-pic {
          flex: none;
          margin-right: 20px;
          border-radius: 16px;
          overflow: hidden;
          &:first-child {
            padding-left: 24px;
          }
          &:last-child {
            margin-right: 0;
            padding-right: 24px;
          }
        }
      }
    }
  }
  .divider {
    width: 702px;
    height: 1px;
    background: #ededed;
    margin: 0 auto;
  }
  .products {
    overflow: hidden;
    .products-title {
      padding: 32px 24px;
      color: #262626;
      line-height: 36px;
      font-size: 30px;
    }
    .product {
      margin-bottom: 40px;
      padding: 0 24px;
      display: flex;
      position: relative;
      .product-image {
        border-radius: 8px;
        overflow: hidden;
      }
      .product-info {
        flex: 1;
        padding-left: 20px;
        padding-right: 160px;
        overflow: hidden;
        .product-title {
          font-size: 26px;
          line-height: 32px;
          margin-bottom: 8px;
          color: #121212;
          @include ellicpsis;
        }
        .product-photonum {
          font-size: 20px;
          color: #444444;
          line-height: 32px;
          margin-bottom: 4px;
          @include ellicpsis;
        }
      }
      .product-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        color: #ff5900;
        line-height: 30px;
        position: absolute;
        right: 24px;
        top: 50%;
        transform: translateY(-50%);
        width: 152px;
        height: 60px;
        /* 圆角渐变边框 */
        box-sizing: border-box;
        border-radius: 32px;
        padding: 2px;
        background-image: linear-gradient(#ffffff, #ffffff),
          linear-gradient(270deg, #ff5900, #ff8800 99%);
        background-clip: content-box, padding-box;
      }
    }
  }
}
</style>
