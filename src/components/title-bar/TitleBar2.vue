<template>
  <div id="title-bar" class="title-bar">
    <div class="title-bar-wrap">
      <div class="city-info" @click="cityClick">
        <div class="city-name">{{ cityName }}</div>
        <img src="@/assets/images/title-bar/icon-down.png" />
      </div>
      <div class="split"></div>
      <div class="search-info" @click="searchClick">
        <img src="@/assets/images/title-bar/icon-search2.png" />
        <div class="search-placeholder">{{ placeholder }}</div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { DefaultCity } from '@/constant/city'
import {} from '@/utils'
import { Toast } from 'vant'
import { getCurrentInstance, inject, toRefs } from 'vue'

const props = defineProps({
  cityName: {
    type: String,
    default: DefaultCity.cityName
  },
  placeholder: {
    type: String,
    default: '请输入想要分享的商品'
  },
  citypicker: {
    type: String,
    default: 'life'
  }
})
const internalInstance = getCurrentInstance()

const searchClick = async () => {
  const link = `https://life.cekid.com/h5/search?shareEarn=1`

  location.href = link + '&kwtarget=blank'
}
const cityClick = () => {
  const { citypicker } = toRefs(props)
  switch (citypicker.value) {
    case 'party':
      location.href = `https://party.cekid.com/common/citypicker?referer=${encodeURIComponent(
        location.href
      )}`
      break
    default:
      location.href = `https://life.cekid.com/h5/city-choose${encodeURIComponent(
        location.href
      )}`
      break
  }
}
</script>

<style lang="scss" scoped>
.title-bar {
  height: 116px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 32px;
  box-sizing: border-box;
  .title-bar-wrap {
    flex: 1;
    height: 68px;
    border: 2px solid rgba(222, 222, 222, 1);
    border-radius: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    .city-info {
      padding-left: 28px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 18px;
      .city-name {
        font-size: 26px;
        color: #15161f;
        margin-right: 12px;
      }
      img {
        width: 12px;
        height: 12px;
        pointer-events: none;
      }
    }
    .split {
      width: 2px;
      height: 28px;
      opacity: 0.2;
      background: #cfcfcf;
      margin-right: 20px;
    }
    .search-info {
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      .search-placeholder {
        font-size: 26px;
        color: #c7c7cc;
      }
    }
  }
}
</style>
