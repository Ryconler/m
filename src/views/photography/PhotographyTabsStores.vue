<template>
  <div class="tabs-stores">
    <div class="stores-title pf-medium">拍摄门店</div>
    <a
      v-for="item in stores"
      :key="item.storeId"
      class="store"
      :href="getShopUrl(item)"
    >
      <div class="store-icon"></div>
      <div class="store-info">
        <div class="store-title pf-simbold">{{ item.shortName }}</div>
        <div class="store-address">{{ item.addressStreet }}</div>
        <div v-if="item.distance >= 0" class="store-distance">
          距您 {{ getDistanceKm(item.distance) }} km
        </div>
      </div>
      <div class="store-btn"></div>
      <div class="store-divider"></div>
    </a>
  </div>
</template>
<script lang="ts" setup>
import { getDistanceKm } from '@/utils'
import { PropType } from 'vue'

defineProps({
  stores: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  }
})

const getShopUrl = (store: any) => {
  return '/xbuy-event/1'
}
</script>
<style lang="scss" scoped>
.tabs-stores {
  background: #ffffff;
  .stores-title {
    margin: 0 24px;
    padding: 32px 0 24px;
    color: #121212;
    line-height: 36px;
    font-size: 30px;
    border-bottom: 1px solid #ededed;
  }
  .store {
    padding: 24px 24px 0;
    display: flex;
    position: relative;
    .store-icon {
      width: 34px;
      height: 34px;
      background: url('@/assets/images/photography/icon-address.png')
        center/28px 28px no-repeat;
      margin-right: 12px;
    }
    .store-info {
      flex: 1;
      padding-right: 36px;
      padding-bottom: 24px;
      overflow: hidden;
      border-bottom: 1px solid #ededed;
      .store-title {
        font-size: 28px;
        color: #121212;
        line-height: 34px;
        margin-bottom: 16px;
        @include ellipsis;
      }
      .store-address {
        font-size: 26px;
        color: #262626;
        line-height: 32px;
        margin-bottom: 12px;
        @include ellipsis;
      }
      .store-distance {
        font-size: 26px;
        color: #999999;
        line-height: 32px;
      }
    }
    .store-btn {
      position: absolute;
      top: 50%;
      right: 24px;
      transform: translateY(-50%);
      width: 36px;
      height: 36px;
      background: url('@/assets/images/photography/icon-more.png') 0 0/100% 100%
        no-repeat;
    }
  }
}
</style>
