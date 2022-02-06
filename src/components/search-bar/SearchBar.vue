<template>
  <div class="search-bar">
    <VanSearch
      v-model="searchValue"
      placeholder="搜索还没有做好"
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
</template>

<script lang="ts" setup>
import { Search as VanSearch, Toast } from 'vant'
import clearIcon from '@/assets/images/search-bar/icon-clear.png'
import { getSearchBarData } from '@/composables/search-bar/searchBar'

const { searchValue } = getSearchBarData()
const searchClick = () => {
  Toast(searchValue.value)
}
</script>

<style lang="scss" scoped>
.search-bar {
  box-sizing: border-box;
  width: 750px;
  height: 88px;
  background-color: white;
  display: flex;
  align-items: center;
  position: relative;
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
