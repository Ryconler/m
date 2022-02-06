<template>
  <div class="home-main">
    <VanSwipe
      v-if="banners.length > 0"
      class="banner"
      :autoplay="6000"
      :show-indicators="banners.length > 1"
      :loop="true"
    >
      <VanSwipeItem
        v-for="(item, index) in banners"
        :key="index"
        @click="bannerClick(item)"
      >
        <BaseImg :src="item.img" height="240" />
      </VanSwipeItem>
    </VanSwipe>
    <VanNoticeBar
      v-if="ads.length > 0"
      class="notice"
      color="#ff6010"
      background="#fff9ed"
      left-icon="volume-o"
      :scrollable="false"
      mode="link"
      @click="adClick"
    >
      <template #left-icon>
        <i class="notice-icon"></i>
      </template>
      <template #default>
        <VanSwipe
          class="notice-texts"
          vertical
          :autoplay="3000"
          :show-indicators="false"
          @change="adChange"
        >
          <VanSwipeItem
            v-for="(item, index) in ads"
            :key="index"
            class="notice-text"
          >
            {{ item.title }}
          </VanSwipeItem>
        </VanSwipe>
      </template>
      <template #right-icon>
        <i v-if="ads[adIndex].link" class="notice-arrow"></i>
      </template>
    </VanNoticeBar>
    <div v-if="recommendElements.length > 0" class="recommend">
      <div class="title"></div>
      <ElementItem
        v-for="(item, index) in recommendElements"
        :key="index"
        class="recommend-item"
        group-title-show
        :element="item"
        @add-success="$toast('添加成功')"
        @add-exist="$toast('已存在清单中')"
        @add-fail="$toast('添加失败')"
      ></ElementItem>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  Swipe as VanSwipe,
  SwipeItem as VanSwipeItem,
  NoticeBar as VanNoticeBar
} from 'vant'
import { getHomeMain } from '@/composables/home/homeMain'
import { PropType, toRefs } from 'vue'
import { CityType, DefaultCity } from '@/utils'

const props = defineProps({
  cityInfo: {
    type: Object as PropType<CityType>,
    default() {
      // eslint-disable-next-line vue/valid-define-props
      return DefaultCity
    }
  }
})
const { cityInfo } = toRefs(props)

const {
  banners,
  bannerClick,
  ads,
  adIndex,
  adClick,
  adChange,
  recommendElements
} = getHomeMain(cityInfo)
</script>
<style lang="scss" scoped>
.home-main {
  background: white;
  padding: 0 24px;
  overflow: hidden;

  .banner {
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 16px;
    overflow: hidden;
    :deep(.van-swipe__indicators) {
      bottom: 10px;
      .van-swipe__indicator {
        width: 6px;
        height: 6px;
        border-radius: 3px;
      }
      .van-swipe__indicator--active {
        background-color: #fff;
        width: 14px;
        height: 6px;
        border-radius: 3px;
      }
    }
  }
  .notice {
    height: 76px;
    line-height: 76px;
    font-size: 28px;
    border-radius: 7px;
    padding: 0 24px;
    margin-bottom: 20px;
    .notice-icon {
      width: 36px;
      height: 36px;
      background: url('@/assets/images/home/icon-notice.png') 0 0/100% 100%
        no-repeat;
      margin-right: 16px;
    }
    .notice-texts {
      height: 76px;
      line-height: 76px;
      .notice-text {
        @include ellicpsis;
      }
    }
    .notice-arrow {
      width: 36px;
      height: 36px;
      background: url('@/assets/images/home/icon-more.png') 0 0/100% 100%
        no-repeat;
    }
  }
  .recommend {
    padding: 20px;
    background: url('@/assets/images/home/bg-recommend.png') 0 0/100% auto
      no-repeat;
    background-color: #fbe5a1;
    .title {
      width: 190px;
      height: 52px;
      background: url('@/assets/images/home/icon-jrzt.png') 0 0/100% 100%
        no-repeat;
      margin: 4px auto 26px;
    }
    .recommend-item {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
  & > *:last-child {
    margin-bottom: 0;
  }
}
</style>
