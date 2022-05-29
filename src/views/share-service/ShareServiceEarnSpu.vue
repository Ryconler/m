<template>
  <div class="share-spu">
    <div class="spu-info" @click="spuInfoClick">
      <BaseImg
        class="spu-image"
        :src="spu.cmmdtyImage"
        :width="186"
        :height="140"
      />
      <div class="spu-detail">
        <div class="spu-name pf-medium"><i></i>{{ spu.spuName }}</div>
        <div class="spu-function">
          <div class="spu-money">
            <ProductPrice3
              class="spu-price"
              :price="spu.minPrice"
              :max-price="spu.maxPrice"
            ></ProductPrice3>
            <div v-if="maxShareAmount > 0" class="spu-earn">
              赚<template v-if="minShareAmount == maxShareAmount"
                >¥{{ getYenPrice(minShareAmount) }}</template
              >
              <template v-else
                >¥{{ getYenPrice(minShareAmount) }}-¥{{
                  getYenPrice(maxShareAmount)
                }}</template
              >
            </div>
          </div>
          <div class="spu-share" @click="spuShareClick">立即分享</div>
        </div>
      </div>
      <div v-if="recommended" class="recommend-icon"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType, ref, Ref, toRefs } from 'vue'
import { getYenPrice } from '@/utils'
import { isEmpty } from 'lodash'

const props = defineProps({
  spu: {
    type: Object as PropType<any>,
    default() {
      return {}
    }
  },
  /* 实际SpuId，搜索门票的spuId在businessId上 */
  realSpuId: {
    type: Number,
    default: null
  },
  minShareAmount: {
    type: Number,
    default: 0
  },
  maxShareAmount: {
    type: Number,
    default: 0
  },
  recommended: {
    type: Boolean,
    default: false
  }
})
const { spu, realSpuId } = toRefs(props)

const { spuInfoClick, spuShareClick } = ((
  spu: Ref<any>,
  realSpuId: Ref<number>
) => {
  const spuInfoClick = async () => {
    location.href = ``
  }
  const spuShareClick = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
  }
  return {
    spuInfoClick,
    spuShareClick
  }
})(spu, realSpuId)
</script>

<style lang="scss" scoped>
.share-spu {
  .spu-info {
    position: relative;
    display: flex;
    background: #ffffff;
    border-radius: 16px;
    padding: 24px 24px 32px;
    .spu-image {
      flex: none;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 20px;
    }

    .spu-detail {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .spu-name {
        font-size: 28px;
        color: #121212;
        line-height: 40px;
        @include ellicpsisN(2);
      }
      .spu-function {
        display: flex;
        align-items: flex-end;
        .spu-money {
          flex: 1;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .spu-price {
            margin-right: 12px;
          }
          .spu-earn {
            font-size: 26px;
            color: #fba032;
            line-height: 32px;
          }
        }
        .spu-share {
          flex: none;
          width: 160px;
          font-size: 26px;
          color: #ffffff;
          text-align: center;
          line-height: 48px;
          background: #ff397e;
          border-radius: 32px;
        }
      }
    }

    .recommend-icon {
      position: absolute;
      width: 30px;
      height: 34px;
      top: 24px;
      left: 32px;
      background: url('@/assets/images/share-service/icon-recommend.png') 0 0/100%
        100% no-repeat;
    }
  }
}
</style>
