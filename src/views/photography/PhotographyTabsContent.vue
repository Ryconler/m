<template>
  <div class="tabs-content">
    <div v-if="showTabName" class="content-title pf-simbold">{{ tabname }}</div>
    <div v-if="themes.length > 0" class="themes">
      <div v-for="item in themes" :key="item.themeId" class="theme">
        <div class="theme-title pf-medium">
          {{ item.themeName }}（{{
            item.themePics ? item.themePics.length : 0
          }}）
        </div>
        <div class="theme-pics">
          <BaseImg
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
    <div v-if="products.length > 0" class="products">
      <div class="products-title pf-medium"><i></i>套餐推荐</div>
      <div class="products-list">
        <a
          v-for="item in products"
          :key="item.spuId"
          class="product"
          :href="getProductUrl(item)"
        >
          <div class="product-detail">
            <BaseImg
              class="product-image"
              width="120"
              height="120"
              :src="item.cmmdtyImage"
            />
            <div class="product-info">
              <div class="product-title">{{ item.spuName }}</div>
              <div
                v-if="getPhotonumText(item.photoItem)"
                class="product-photonum"
              >
                {{ getPhotonumText(item.photoItem) }}
              </div>
              <ProductPrice class="product-price-wrap" :price="item.minPrice" />
            </div>
            <div class="product-btn pf-medium">查看详情</div>
          </div>
          <div v-if="getRecommendDesc(item)" class="product-recommend">
            <div class="product-recommend-icon">
              <i></i><span class="pf-medium">推荐</span>
            </div>
            <div class="product-recommend-text">
              {{ getRecommendDesc(item) }}
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, PropType, Ref, ref, toRefs } from 'vue'

const props = defineProps({
  showTabName: {
    type: Boolean,
    default() {
      return true
    }
  },
  tabname: {
    type: String,
    default: ''
  },
  themes: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  },
  products: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  }
})
const { tabname } = toRefs(props)

const emit = defineEmits(['theme-pic-click'])

const photographyConfig: Ref<any> = inject('photographyConfig', ref({}))

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

const getPhotonumText = (photoItem: string) => {
  if (photoItem) {
    try {
      const items: any[] = JSON.parse(photoItem)
      if (items.length > 0) {
        const photeRepairNum = items[0].photeRepairNum
        const photoNum = items[0].photoNum
        return `拍摄≥${photoNum}张 | ${photeRepairNum}张精修`
      }
    } catch (e) {
      console.error(e)
    }
  }
  return ''
}

const getRecommendDesc = (product: any) => {
  const negativesGiveDescs = photographyConfig.value.negativesGiveDescs || {}
  const maxNegativesGive = getProductGiveNegatives(product)
  return maxNegativesGive && negativesGiveDescs[maxNegativesGive]
}

const getProductUrl = (product: any) => {
  return `https://wwww.baidu.com`
}

const themePicClick = (theme: any, picIndex: number) => {
  emit('theme-pic-click', theme, picIndex)
}
</script>
<style lang="scss" scoped>
.tabs-content {
  overflow: hidden;
  background: linear-gradient(180deg, #fff7f4, #ffffff 21%, #ffffff);
  & > div:last-child {
    margin-bottom: 32px;
  }
  .content-title {
    position: relative;
    font-size: 32px;
    color: #451a0c;
    text-align: center;
    line-height: 64px;
    padding-top: 20px;
    background: url('@/assets/images/photography/bg-title.png') 0 0/100% auto
      no-repeat;
  }
  .themes {
    .theme {
      .theme-title {
        padding: 40px 24px 24px;
        height: 36px;
        overflow: hidden;
        font-size: 30px;
        line-height: 36px;
        @include ellipsis;
      }
      .theme-pics {
        display: flex;
        overflow-x: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .theme-pic {
          flex: none;
          margin-right: 20px;
          &:first-child {
            padding-left: 24px;
          }
          &:last-child {
            margin-right: 0;
            padding-right: 24px;
          }
          & :deep(img) {
            border-radius: 16px;
          }
        }
      }
    }
  }
  .products {
    background: url('@/assets/images/photography/bg-products.png') 0 0/100% auto
      no-repeat;
    .products-title {
      display: flex;
      align-items: center;
      padding: 48px 24px 24px;
      color: #262626;
      line-height: 36px;
      font-size: 30px;
      i {
        display: block;
        width: 36px;
        height: 36px;
        background: url('@/assets/images/photography/icon-recommend.png') 0 0/100%
          auto no-repeat;
        margin-right: 8px;
      }
    }
    .products-list {
      margin: 0 24px;
      background: #ffffff;
      box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      .product {
        display: block;
        padding: 24px 0;
        margin: 0 20px;
        &:not(:last-child) {
          border-bottom: 1px solid #ededed;
        }
        .product-detail {
          display: flex;
          position: relative;
          .product-image {
            border-radius: 8px;
            overflow: hidden;
          }
          .product-info {
            flex: 1;
            padding: 0 20px;
            overflow: hidden;
            .product-title {
              font-size: 26px;
              line-height: 32px;
              margin-bottom: 8px;
              color: #121212;
              @include ellipsis;
            }
            .product-photonum {
              font-size: 20px;
              color: #444444;
              line-height: 32px;
              margin-bottom: 4px;
              @include ellipsis;
            }
            .product-price-wrap {
              height: 44px;
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
            right: 0;
            bottom: 0;
            width: 152px;
            height: 60px;
            /* 圆角渐变边框 */
            box-sizing: border-box;
            border-radius: 30px;
            /* prettier-ignore */
            padding: 1Px;
            background-image: linear-gradient(#ffffff, #ffffff),
              linear-gradient(270deg, #ff5900, #ff8800);
            background-clip: content-box, padding-box;
          }
        }
        .product-recommend {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          overflow: hidden;
          margin-top: 10px;
          border-radius: 4px;
          .product-recommend-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 40px;
            background: #ffe9b4;
            border-radius: 4px;
            i {
              display: block;
              width: 28px;
              height: 28px;
              background: url('@/assets/images/photography/icon-good.png') 0 0/100%
                100% no-repeat;
              margin-right: 8px;
            }
            span {
              font-size: 22px;
              color: #ff5900;
              line-height: 24px;
            }
          }
          .product-recommend-text {
            padding: 0 24px;
            font-size: 22px;
            color: #ff8800;
            height: 40px;
            line-height: 40px;
            background: #fff6e2;
          }
        }
      }
    }
  }
}
</style>
