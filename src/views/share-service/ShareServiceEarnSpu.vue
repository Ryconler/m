<template>
  <div ref="shareSpu" class="share-spu">
    <div class="spu-info" @click="spuInfoClick">
      <BaseImg
        class="spu-image"
        :src="spu.cmmdtyImage"
        :width="186"
        :height="140"
      />
      <div class="spu-detail">
        <div class="spu-name pf-medium">{{ spu.spuName }}</div>
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
          <div
            class="spu-share"
            :class="spu.materialFlag && 'has-material'"
            @click="spuShareClick"
          >
            <i></i>分享
          </div>
        </div>
        <div class="spu-store">
          <div class="spu-store-name">{{ spu.storeName }}</div>
          <div v-if="spuSaleNum" class="spu-sale-num">已售{{ spuSaleNum }}</div>
        </div>
      </div>
      <div v-if="recommended" class="recommend-icon"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, PropType, Ref, ref, toRefs } from 'vue'
import { ShareSpuType } from '@/constant/shareService'
import {
  useSpuInfo,
  useSpuShare
} from '@/composables/share-service/shareServiceEarnSpu'
import { getYenPrice } from '@/utils'

const props = defineProps({
  spu: {
    type: Object as PropType<ShareSpuType>,
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
  },
  shareCityCode: {
    type: String,
    default: ''
  }
})
const { spu, realSpuId, shareCityCode } = toRefs(props)

const emit = defineEmits(['inView'])

const { spuSaleNum, spuInfoClick } = useSpuInfo(spu, realSpuId)
const { spuShareClick } = useSpuShare(spu, realSpuId, shareCityCode)

const intersectionObserver: Ref<IntersectionObserver | null> = ref(null)
const shareSpu = ref()

onMounted(async () => {
  if (IntersectionObserver && shareSpu.value) {
    intersectionObserver.value = new IntersectionObserver(entries => {
      // If intersectionRatio is 0, the target is out of view
      // and we do not need to do anything.
      if (entries[0].intersectionRatio <= 0) return
      emit('inView')
      intersectionObserver.value?.unobserve(shareSpu.value)
    })
    // start observing
    intersectionObserver.value.observe(shareSpu.value)
  } else {
    emit('inView')
  }
})
</script>

<style lang="scss" scoped>
.share-spu {
  .spu-info {
    position: relative;
    display: flex;
    background: #ffffff;
    border-radius: 16px;
    padding: 24px 0 32px 24px;
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
      overflow: hidden;
      .spu-name {
        padding-right: 24px;
        font-size: 28px;
        color: #121212;
        line-height: 40px;
        @include ellicpsisN(2);
      }
      .spu-function {
        display: flex;
        align-items: center;
        padding-right: 24px;
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
          display: flex;
          justify-content: center;
          align-items: center;
          width: 180px;
          height: 56px;
          font-size: 26px;
          color: #ffffff;
          line-height: 30px;
          background: #ff397e;
          border-radius: 28px;
          position: relative;
          i {
            width: 28px;
            height: 28px;
            background: url('@/assets/images/share-service/icon-share.png') 0 0/100%
              100% no-repeat;
            margin-right: 8px;
          }
          &.has-material::after {
            content: '有素材';
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            width: 84px;
            height: 28px;
            background: url(@/assets/images/share-service/icon-has_material.png)
              0 0/100% 100% no-repeat;
            color: #ffffff;
            font-size: 18px;
            position: absolute;
            top: -17px;
            right: -8px;
          }
        }
      }
      .spu-store {
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        padding-right: 24px;
        .spu-store-name {
          flex: 1;
          font-size: 22px;
          color: #666666;
          line-height: 28px;
          @include ellicpsis;
        }
        .spu-sale-num {
          flex: none;
          line-height: 28px;
          font-size: 22px;
          color: #999999;
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
