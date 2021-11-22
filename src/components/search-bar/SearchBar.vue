<template>
  <!-- 搜索中，可输入 -->
  <div v-if="isSearching" class="search-bar searching">
    <VanSearch
      v-model="searchValue"
      :placeholder="searchBarConfig.placeholder"
      shape="round"
      :clear-icon="clearIcon"
      autofocus
      show-action
      clear-trigger="always"
      @search="searchClick"
    >
      <template #left-icon>
        <img src="@/assets/images/search-bar/icon-search.png" />
      </template>
      <template #action>
        <div @click="searchClick">搜索</div>
      </template>
    </VanSearch>
  </div>
  <!-- 未搜索，不可输入 -->
  <div v-else class="search-bar nosearch">
    <div class="city-info" @click="cityClick">
      <div class="city-name">{{ selectCity?.cityName }}</div>
      <img src="@/assets/images/search-bar/icon-switchcity.png" />
    </div>
    <div class="search-input" @click="inputClick">
      <img src="@/assets/images/search-bar/icon-search.png" />
      <div class="search-placeholder">{{ searchBarConfig.placeholder }}</div>
    </div>
    <div class="user-avatar" @click="avatarClick">
      <img src="@/assets/images/search-bar/icon-avatar.png" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { Search as VanSearch } from 'vant'
import clearIcon from '@/assets/images/search-bar/icon-clear.png'
import { getSearchBarData } from '@/composables/search-bar/searchBar'

defineProps({
  isSearching: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const { searchBarConfig, selectCity, searchValue } = getSearchBarData()
const cityClick = () => {
  router.push({
    name: 'cityChoose',
    query: {
      referrer: location.href
    }
  })
}
const inputClick = () => {
  router.push({
    name: 'search',
    query: {
      referrer: location.href
    }
  })
}
const searchClick = () => {
  console.log(searchValue)
}
const avatarClick = () => {
  router.push({
    name: 'photography'
  })
}
</script>

<style lang="scss" scoped>
.search-bar {
  width: 100%;
  height: 88px;
  background-color: white;
  display: flex;
  align-items: center;
  position: relative;
  /* 给titlebar一个超出顶部2px白色背景，解决滑动时fixed布局出现抖动导致顶部露出空隙的问题 */
  &::before {
    content: '';
    display: block;
    position: absolute;
    background: white;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: -4px;
    // 必须要设置translateZ(0),开启gpu渲染
    transform: translate3d(0, -4px, 0);
  }
}
.search-bar.nosearch {
  .city-info {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 200px;
    height: 100%;
    padding: 0 20px;
    .city-name {
      margin-right: 8px;
      font-size: 28px;
      color: $deep-text-color;
      font-weight: bold;
      @include ellicpsis;
    }
    img {
      width: 20px;
      height: 20px;
    }
  }
  .search-input {
    flex: 1;
    height: 60px;
    background: $light-bg-color;
    border-radius: 60px;
    padding: 0 26px;
    display: flex;
    align-items: center;
    img {
      margin-right: 10px;
      width: 26px;
      height: 26px;
      display: block;
    }
    .search-placeholder {
      font-size: 26px;
      line-height: 30px;
      display: flex;
      align-items: center;
      line-height: normal;
      color: $light-text-color;
    }
  }
  .user-avatar {
    width: 88px;
    height: 88px;
    padding: 20px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.search-bar.searching {
  padding: 0 20px;
  :deep(.van-search) {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0;
    /* 左侧输入框 */
    .van-search__content {
      flex: 1;
      padding-left: 0;
      .van-search__field {
        display: flex;
        align-items: center;
        border: 1px solid $light-text-color;
        border-radius: 60px;
        height: 60px;
        padding: 0 26px;
        // 搜索图标
        .van-field__left-icon {
          margin-right: 10px;
          img {
            width: 26px;
            height: 26px;
            display: block;
          }
        }
        // 输入框
        .van-cell__value {
          flex: 1;
          // 实际输入框
          .van-field__body {
            display: flex;
            align-items: center;
            input {
              flex: 1;
              border: none;
              font-size: 26px;
              line-height: 30px;
              width: 100%;
            }
            // 清除图标按钮
            .van-field__clear {
              margin-left: 10px;
              img {
                width: 30px;
                height: 30px;
                display: block;
              }
            }
          }
        }
      }
    }
    /* 右侧搜索按钮 */
    .van-search__action {
      margin-left: 20px;
      background: $light-bg-color;
      color: $deep-text-color;
      border-radius: 60px;
      width: 120px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 26px;
    }
  }
}
</style>
