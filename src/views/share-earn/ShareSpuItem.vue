<template>
  <div class="share-spu-item">
    <a class="spu-info" :href="spuLink">
      <BaseImg
        class="spu-image"
        :src="spu.cmmdtyImage"
        :width="storeShow ? 230 : 186"
        :height="storeShow ? 171 : 140"
      />
      <div class="spu-detail">
        <div class="spu-name pf-medium">{{ spu.spuName }}</div>
        <div v-if="storeShow" class="spu-store">
          <div class="spu-store-name">{{ spu.storeName }}</div>
          <div v-if="spuSaleNum" class="spu-store-distance">
            已售{{ spuSaleNum }}
          </div>
        </div>
        <div class="spu-option">
          <ProductPrice2
            class="spu-price"
            :price="spu.minPrice"
            :max-price="spu.maxPrice"
          ></ProductPrice2>
          <div v-if="maxShareAmount > 0" class="spu-earn">
            <div class="spu-earn-icon">赚</div>
            <div class="spu-earn-money pf-medium">
              <template v-if="minShareAmount == maxShareAmount">{{
                getYenPrice(minShareAmount)
              }}</template>
              <template v-else
                >{{ getYenPrice(minShareAmount) }}-{{
                  getYenPrice(maxShareAmount)
                }}</template
              >
              元
            </div>
          </div>
        </div>
      </div>
    </a>
    <div class="spu-operates">
      <div v-if="inList" class="spu-operate-del" @click="spuDelClick">删除</div>
      <div v-else class="spu-operate-add" @click="spuAddClick">加入清单</div>
      <div class="spu-operate-share pf-medium" @click="spuShareClick">
        立即分享
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType, ref, Ref, toRefs } from 'vue'
import { ensureLogin, getYenPrice, toDemotion } from '@/utils'
import { isEmpty, isNumber } from 'lodash'
import { addSpuCheckList, delSpuCheckList } from '@/api/shareEarn'
import { Toast } from 'vant'

const emit = defineEmits([
  'add-success',
  'add-exist',
  'add-fail',
  'del-success',
  'del-fail'
])
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
  storeShow: {
    type: Boolean,
    default: false
  },
  inList: {
    type: Boolean,
    default: false
  }
})
const { spu, realSpuId } = toRefs(props)

const { spuLink, spuSaleNum } = ((spu: Ref<any>, realSpuId: Ref<number>) => {
  const spuLink = computed(() => {
    if (spu.value.templateType2Id == 601) {
      if (realSpuId.value == spu.value.spuId) {
        // 搜索的门票skuId会挂在spuId字段上，其他地方如果没有给skuId就跳转到多规格的门票详情
        return ``
      }
    }
    return (
      // 人客商详进入通过allowRefreshOrShare(false, false)禁用分享后又被意外的设置允许了（原因暂未找到）
      // 这里先不改商详代码，但为了保证商详分享按钮能够在图文生成后露出，这里在url上设置sharetype=0先禁止页面分享
      // 待图文生成后会商详代码会调用window.kwapp.allowRefreshOrShare(false, true);重新露出分享按钮
      ``
    )
  })
  const spuSaleNum = computed(() => {
    const saleNum = +spu.value.saleNum
    if (saleNum >= 10000) {
      return toDemotion(saleNum, 10000) + '万'
    }
    if (isNumber(saleNum)) {
      return saleNum
    }
    return 0
  })
  return { spuLink, spuSaleNum }
})(spu, realSpuId)

const { spuAddClick, spuDelClick } = ((
  emit: any,
  spu: Ref<any>,
  realSpuId: Ref<number>
) => {
  const spuAddClick = async () => {
    ensureLogin()
    const result = await addSpuCheckList(realSpuId.value)
    if (result == 1) {
      emit('add-success')
    } else if (result == 3) {
      emit('add-exist')
    } else {
      emit('add-fail')
    }
  }

  const spuDelClick = async () => {
    ensureLogin()
    const result = await delSpuCheckList(realSpuId.value)
    if (result == 1) {
      emit('del-success')
    } else {
      emit('del-fail')
    }
  }
  return { spuAddClick, spuDelClick }
})(emit, spu, realSpuId)

const { spuShareClick } = ((spu: Ref<any>, realSpuId: Ref<number>) => {
  const spuShareClick = () => {}
  return {
    spuShareClick
  }
})(spu, realSpuId)
</script>

<style lang="scss" scoped>
.share-spu-item {
  display: block;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  .spu-info {
    display: flex;
    margin-bottom: 26px;
    .spu-image {
      flex: none;
      border-radius: 16px;
      overflow: hidden;
      margin-right: 20px;
    }

    .spu-detail {
      flex: 1;
      overflow: hidden;
      .spu-name {
        font-size: 28px;
        color: #121212;
        line-height: 42px;
        margin-bottom: 12px;
        @include ellicpsisN(2);
      }
      .spu-store {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        overflow: hidden;
        .spu-store-name {
          flex: 1;
          font-size: 22px;
          color: #666666;
          line-height: 28px;
          @include ellicpsis;
        }
        .spu-store-distance {
          flex: none;
          line-height: 28px;
          font-size: 22px;
          color: #999999;
        }
      }
      .spu-option {
        display: flex;
        align-items: center;
        .spu-price {
          margin-right: 20px;
        }
        .spu-earn {
          display: flex;
          align-items: center;
          border: 1px #ff5900 #979797;
          border-radius: 30px;
          .spu-earn-icon {
            height: 36px;
            line-height: 36px;
            padding-left: 36px;
            padding-right: 4px;
            color: #ffffff;
            font-size: 22px;
            background: url('@/assets/images/share-earn/icon-money.png') 12px
              center/ 23px 30px no-repeat;
            background-color: #ff7615;
            border-top-left-radius: 30px;
            border-bottom-left-radius: 30px;
          }
          .spu-earn-money {
            height: 36px;
            line-height: 36px;
            padding-left: 4px;
            padding-right: 12px;
            font-size: 22px;
            color: #ff5900;
            background: #fff9ed;
            border-top-right-radius: 30px;
            border-bottom-right-radius: 30px;
            @include ellicpsis;
          }
        }
      }
    }
  }
  .spu-operates {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20px;
    border: 1px #ff5900 #ededed;
    .spu-operate-add {
      width: 152px;
      height: 60px;
      font-size: 26px;
      line-height: 60px;
      text-align: center;
      margin-right: 20px;
      border: 1px solid #cccccc;
      border-radius: 60px;
    }
    .spu-operate-del {
      width: 100px;
      height: 60px;
      font-size: 26px;
      line-height: 60px;
      text-align: center;
      margin-right: 20px;
      border: 1px solid #cccccc;
      border-radius: 60px;
    }
    .spu-operate-share {
      width: 152px;
      height: 60px;
      font-size: 26px;
      color: #ff5900;
      border-radius: 30px;
      text-align: center;
      line-height: 56px;
      box-sizing: border-box;
      padding: 2px;
      background-image: linear-gradient(#ffffff, #ffffff),
        linear-gradient(270deg, #ff5900, #ff8800);
      background-clip: content-box, padding-box;
    }
  }
}
</style>
