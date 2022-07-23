<template>
  <div v-if="eventInfo.skuId >= 0" class="xbuy-event-header">
    <BaseImg
      class="event-image"
      :src="eventInfo.cmmdtyImage"
      width="220"
      height="220"
    />
    <div class="event-info">
      <div class="event-title pf-medium">
        {{ eventInfo.skuName }}
      </div>
      <div class="event-price">
        售价：¥{{ eventInfo.price }}｜剩余：{{ eventInfo.availableInventory }}份
      </div>
      <div class="event-help pf-medium">
        需{{ eventInfo.assistanceNum }}人助力
      </div>
      <div class="event-promotion">
        <div class="event-promotion-price">
          <span>抢购价</span>
          <i></i>
          <span
            >¥{{ eventInfo.promPrice }}{{ !!eventInfo.begin ? '起' : '' }}</span
          >
        </div>
        <div class="event-promotion-sku" @click="jumpSku">商品详细信息</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType, toRefs } from 'vue'
import { EventType } from '@/constant/xbuyEvent'
import { toNumber } from 'lodash'

const props = defineProps({
  eventInfo: {
    type: Object as PropType<EventType>,
    default() {
      return {}
    }
  }
})
const { eventInfo } = toRefs(props)

const jumpSku = () => {
  location.href = '/share-service'
}
</script>
<style lang="scss" scoped>
.xbuy-event-header {
  display: flex;
  padding: 20px;
  .event-image {
    flex: none;
    width: 220px;
    height: 220px;
    border-radius: 16px;
    margin-right: 20px;
    overflow: hidden;
  }
  .event-info {
    flex: 1;
    .event-title {
      height: 80px;
      font-size: 30px;
      color: #262626;
      line-height: 40px;
      margin-bottom: 8px;
      @include ellipsisN(2);
    }
    .event-price {
      font-size: 24px;
      color: #7f7f7f;
      line-height: 32px;
      margin-bottom: 8px;
    }
    .event-help {
      font-size: 24px;
      color: #ff5900;
      line-height: 36px;
      margin-bottom: 12px;
    }
    .event-promotion {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .event-promotion-price {
        display: flex;
        align-items: center;
        span:first-child {
          width: 90px;
          height: 44px;
          text-align: center;
          line-height: 44px;
          font-size: 22px;
          color: #ff3a3f;
          background-image: linear-gradient(270deg, #fffae9 0%, #fff2cf 100%);
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }
        i {
          width: 16px;
          height: 44px;
          background: url('https://hzwimspic-1251601690.image.myqcloud.com/38a6f750-b963-11ec-bb0f-090b40ef428d_size_30x66')
            0 0/100% 100% no-repeat;
          margin-left: -7px;
          margin-right: -9px;
          z-index: 1;
        }
        span:last-child {
          padding: 0 20px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          font-size: 24px;
          color: #ffffff;
          background-image: linear-gradient(90deg, #fc9e57 0%, #fb394c 100%);
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
        }
      }
      .event-promotion-sku {
        color: #666666;
        line-height: 28px;
        font-size: 24px;
        padding-right: 24px;
        background: url(@/assets/images/xbuy-event/icon-right.png) right
          center/24px 24px no-repeat;
      }
    }
  }
}
</style>
