<template>
  <div class="title-bar">
    <div class="city-info" @click="cityClick">
      <div class="pf-simbold">{{ cityName }}</div>
      <img src="@/assets/images/title-bar/icon-select.png" />
    </div>
    <div class="search-wrap" @click="searchClick">
      <img src="@/assets/images/title-bar/icon-search.png" />
      <div>{{ placeholder }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { DefaultCity } from '@/utils'
import { useRouter } from 'vue-router'

defineProps({
  cityName: {
    type: String,
    default: DefaultCity.cityName // eslint-disable-line vue/valid-define-props
  },
  placeholder: {
    type: String,
    default: /* '搜一搜网站里有什么'  */ '搜索还没有做好'
  }
})

const router = useRouter()
const searchClick = () => {
  router.push({
    name: 'search'
  })
}
const cityClick = () => {
  router.push({
    name: 'cityChoose',
    query: {
      referrer: encodeURIComponent(location.href)
    }
  })
}
</script>

<style lang="scss" scoped>
.title-bar {
  width: 100%;
  height: 88px;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  padding: 0 24px;
  justify-content: space-between;
  align-items: center;
  .city-info {
    max-width: 112px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    div {
      font-size: 28px;
      color: #333333;
      line-height: 32px;
      margin-right: 3px;
    }
    img {
      width: 20px;
      height: 20px;
      pointer-events: none;
    }
  }
  .search-wrap {
    flex: 1;
    height: 60px;
    background: #f5f5f5;
    border-radius: 30px;
    display: flex;
    padding: 0 24px;
    align-items: center;
    margin: 0 12px;
    img {
      width: 36px;
      height: 36px;
      margin-right: 7px;
    }
    div {
      font-size: 26px;
      color: #cccccc;
    }
  }
}
</style>
