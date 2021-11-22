<template>
  <VanImagePreview.Component
    id="theme-detail"
    :images="images"
    closeable
    close-icon-position="top-left"
    close-icon="arrow-left"
    teleport="body"
    @change="imageChange"
  >
    <template #index>
      <span class="pf-medium">{{ imageIndex + 1 }}</span>
      <span class="pf-medium gray">/{{ images.length }}</span>
    </template>
    <template #cover>
      <a class="theme-product" :href="productUrl" @click="productClick">
        <div class="product-info">
          <div class="product-title pf-medium">{{ productInfo.spuName }}</div>
          <div class="product-extra">
            <div
              v-if="
                productInfo.photoNum &&
                productInfo.photeRepairNum &&
                productInfo.photoNum >= 0 &&
                productInfo.photeRepairNum >= 0
              "
              class="product-photonum"
            >
              拍摄≥{{ productInfo.photoNum }}张 |
              {{ productInfo.photeRepairNum }}张精修
            </div>
            <ProductPrice :price="productInfo.price"></ProductPrice>
          </div>
        </div>
        <div class="product-btn pf-medium">查看详情</div>
      </a>
      <div class="menu_wkBox_back_box"></div>
    </template>
  </VanImagePreview.Component>
</template>
<script lang="ts" setup>
import { getCurrentInstance, PropType, ref, toRefs } from 'vue'
import { ImagePreview as VanImagePreview } from 'vant'
import {
  getThemePics,
  getProductInfo,
  getImageChange
} from '@/composables/photography/photographyThemeDetail'
import { PhotoContentThemeType } from '@/constant/photography'

const props = defineProps({
  theme: {
    type: Object as PropType<PhotoContentThemeType>,
    default() {
      return {}
    }
  }
})

const internalInstance = getCurrentInstance()
const { theme } = toRefs(props)
const { productInfo, productUrl } = getProductInfo(theme)
const images = getThemePics(theme)
const imageIndex = ref(0)
const imageChange = getImageChange(imageIndex)
const productClick = () => {
  internalInstance &&
    internalInstance.appContext.config.globalProperties.$trackClick({
      bizType: '127',
      pageLevelId: '121013214',
      clickId: '200006'
    })
}
</script>
<style lang="scss">
#theme-detail {
  display: flex;
  flex-direction: column;
  .van-image-preview__close-icon {
    top: 108px;
    left: 24px;
    font-size: 44px;
    color: #ffffff;
  }
  .van-image-preview__swipe {
    height: auto;
    flex: 1;
    .van-image-preview__image {
      &.van-image-preview__image--vertical {
        img {
          width: auto;
        }
      }
      .app-theme-detail-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 168px;
        background-image: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 0.13) 24%,
          rgba(0, 0, 0, 0.8)
        );
        box-sizing: border-box;
        padding: 101px 24px 0;
        .theme-detail-info {
          display: flex;
          flex-wrap: wrap;
          overflow: hidden;
          height: 36px;
          align-items: center;
          .title {
            font-size: 30px;
            color: #ffffff;
            height: 36px;
            line-height: 36px;
            @include ellicpsis;
          }
          .style {
            font-size: 20px;
            color: #ffffff;
            height: 32px;
            line-height: 32px;
            padding: 0 4px;
            background: rgba(255, 255, 255, 0.19);
            margin-left: 20px;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .van-image-preview__index {
    top: 105px;
    line-height: 50px;
    font-size: 36px;
    color: #ffffff;
    .gray {
      color: #999999;
    }
  }
  .van-image-preview__cover {
    position: relative;
    background: #ffffff;
    .theme-product {
      width: 100%;
      padding: 20px 24px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      overflow: hidden;
      .product-info {
        flex: 1;
        .product-title {
          color: #121212;
          font-size: 30px;
          line-height: 36px;
          padding-left: 40px;
          margin-bottom: 15px;
          background: url('@/assets/images/photography/icon-shangpin.png') left
            center/27px 26px no-repeat;
          @include ellicpsis;
        }
        .product-extra {
          display: flex;
          align-items: center;
          .product-photonum {
            font-size: 20px;
            color: #444444;
            line-height: 32px;
            margin-right: 20px;
          }
        }
      }
      .product-btn {
        width: 208px;
        height: 72px;
        opacity: 0.9;
        background: linear-gradient(270deg, #ff5900, #ff8800);
        border-radius: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        line-height: 32px;
        font-size: 26px;
      }
    }
  }
}
</style>
