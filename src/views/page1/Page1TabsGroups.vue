<template>
  <div class="tabs-groups">
    <div class="groups-title pf-medium">拍摄门店</div>
    <a
      v-for="(item, index) in groups"
      :key="index"
      class="store"
      :href="item.link"
    >
      <div class="store-icon"></div>
      <div class="store-info">
        <div class="store-title pf-simbold">{{ item.title }}</div>
        <div class="store-address">{{ item.address }}</div>
        <div v-if="item.subTitle" class="store-sub-title">
          {{ item.subTitle }}
        </div>
      </div>
      <div class="store-btn"></div>
      <div class="store-divider"></div>
    </a>
  </div>
</template>
<script lang="ts" setup>
import { Page1GroupType } from '@/constant/page1'
import { PropType } from 'vue'

defineProps({
  groups: {
    type: Array as PropType<Page1GroupType[]>,
    default() {
      return []
    }
  }
})

const getShopUrl = (store: Page1GroupType) => {
  return ''
}
</script>
<style lang="scss" scoped>
.tabs-groups {
  background: #ffffff;
  .groups-title {
    margin: 0 24px;
    padding: 32px 0 24px;
    color: #121212;
    line-height: 36px;
    font-size: 30px;
    border-bottom: 2px solid #ededed;
  }
  .store {
    padding: 24px 24px 0;
    display: flex;
    position: relative;
    .store-icon {
      width: 34px;
      height: 34px;
      background: url('@/assets/images/page1/icon-address.png') center/28px 28px
        no-repeat;
      margin-right: 12px;
    }
    .store-info {
      flex: 1;
      padding-right: 36px;
      padding-bottom: 24px;
      overflow: hidden;
      border-bottom: 2px solid #ededed;
      .store-title {
        font-size: 28px;
        color: #121212;
        line-height: 34px;
        margin-bottom: 16px;
        @include ellicpsis;
      }
      .store-address {
        font-size: 26px;
        color: #262626;
        line-height: 32px;
        margin-bottom: 12px;
        @include ellicpsis;
      }
      .store-sub-title {
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
      background: url('@/assets/images/page1/icon-more.png') 0 0/100% 100%
        no-repeat;
    }
  }
}
</style>
