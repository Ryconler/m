<template>
  <div class="share-main">
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
        <BaseImg :src="item.img" width="702" height="240" />
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
    <div v-if="recommendSpus.length > 0" class="recommend">
      <img class="title" src="@/assets/images/share-earn/icon-jrzt.png" />
      <ShareSpuItem
        v-for="(item, index) in recommendSpus"
        :key="index"
        class="recommend-item"
        store-show
        :spu="item"
        :real-spu-id="item.spuId"
        :min-share-amount="item.minSaleRate"
        :max-share-amount="item.maxSaleRate"
        @add-success="$toast('添加成功')"
        @add-exist="$toast('商品已存在清单中')"
        @add-fail="$toast('添加失败')"
      ></ShareSpuItem>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  Swipe as VanSwipe,
  SwipeItem as VanSwipeItem,
  NoticeBar as VanNoticeBar
} from 'vant'
import ShareSpuItem from './ShareSpuItem.vue'
import { nextTick, onMounted, PropType, ref, Ref, toRefs } from 'vue'
import { CityType } from 'types/city'
import { DefaultCity } from '@/constant/city'
import { queryShareConfig } from '@/api/shareEarn'

const props = defineProps({
  cityInfo: {
    type: Object as PropType<CityType>,
    default() {
      return DefaultCity
    }
  }
})
const { cityInfo } = toRefs(props)

const banners: Ref<any[]> = ref([])
const ads: Ref<any[]> = ref([])
const recommendSpus: Ref<any[]> = ref([])
onMounted(async () => {
  const shareConfig = await queryShareConfig(cityInfo.value.cityId)
  banners.value = shareConfig.adsList || []
  ads.value = shareConfig.cmsList || []
  recommendSpus.value = shareConfig.spuList || []
  recommendSpus.value.forEach(item => {
    item.storeName = item.storeName || item.businessName
  })
  nextTick(() => {
    const mainDom = document.querySelector('.share-main')
    const mainHeight = mainDom ? mainDom.getBoundingClientRect().height : 0
    window.mainHeight = mainHeight
  })
})

const bannerClick = (banner: any) => {
  if (banner.link) {
    location.href = <string>banner.link
  }
}
const adIndex = ref(0)
const adClick = () => {
  if (ads.value[adIndex.value].link) {
    location.href = <string>ads.value[adIndex.value].link
  }
}
const adChange = (index: number) => {
  adIndex.value = index
}
</script>
<style lang="scss" scoped>
.share-main {
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
      background: url('@/assets/images/share-earn/icon-notice.png') 0 0/100%
        100% no-repeat;
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
      background: url('@/assets/images/share-earn/icon-more.png') 0 0/100% 100%
        no-repeat;
    }
  }
  .recommend {
    padding: 24px 20px 20px;
    background-image: url('@/assets/images/share-earn/bg-recommend.png'),
      linear-gradient(270deg, #fcdf8a 0%, #fdebb9 100%);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 100% auto;
    border-radius: 16px;
    .title {
      width: 190px;
      height: 36px;
      display: block;
      margin: 0 auto 24px;
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
