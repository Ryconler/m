<template>
  <div class="share-service">
    <VanSticky class="title-bar-sticky sticky-fix" style="--fix-bg: #ffffff">
      <TitleBar
        :city-name="cityInfo.cityName"
        citypicker="party"
        placeholder="请输入想要分享的商品"
      >
      </TitleBar>
    </VanSticky>
    <VanSwipe
      v-if="banners.length > 0"
      class="share-service-banner"
      :show-indicators="banners.length > 0"
      :autoplay="6000"
      :loop="true"
    >
      <VanSwipeItem
        v-for="(item, index) in banners"
        :key="index"
        @click="bannerClick(item)"
      >
        <BaseImg :src="item.rotationPic" width="686" height="240" />
      </VanSwipeItem>
    </VanSwipe>
    <ShareServiceTask
      class="share-service-task-comp"
      :tasks="shareTasks"
    ></ShareServiceTask>
    <ShareServiceEarn
      v-if="shareTasksLoaded && locationLoaded"
      class="share-service-earn-comp"
      :position="position"
      :city-info="cityInfo"
      :recommend-spus="recommendSpus"
    ></ShareServiceEarn>
  </div>
</template>
<script lang="ts" setup>
import {
  Swipe as VanSwipe,
  SwipeItem as VanSwipeItem,
  Sticky as VanSticky
} from 'vant'
import { setLoading } from '@/utils'
import { getLocation } from '@/composables/common'
import ShareServiceTask from './ShareServiceTask.vue'
import ShareServiceEarn from './ShareServiceEarn.vue'
import { nextTick, onMounted, Ref, ref } from 'vue'
import { queryShareTask } from '@/api/shareService'
import { useStore } from 'vuex'
import { CityType } from 'types/city'
import { queryShareConfig } from '@/api/shareEarn'

setLoading(true)

const store = useStore()

const { position, cityInfo, locationLoaded } = getLocation()
const banners: Ref<{ rotationPic: string; jumpUrl: string }[]> = ref([])
const shareTasks: Ref<any[]> = ref([])
const shareTasksLoaded = ref(false)

const { recommendSpus } = ((cityInfo: Ref<CityType>) => {
  const store = useStore()

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
  return {
    recommendSpus
  }
})(cityInfo)

onMounted(async () => {
  const { rotationPicList, shareTaskList } = await queryShareTask(
    cityInfo.value.cityId
  )
  banners.value = rotationPicList || []
  shareTasks.value = shareTaskList || []
  nextTick(() => {
    shareTasksLoaded.value = true
  })
  const hserecomkey = ''
  window.hserecomkey = hserecomkey
  setLoading(false)
})

const bannerClick = (banner: any) => {
  location.href = banner.jumpUrl
}
</script>
<style lang="scss" scoped>
.share-service {
  background-image: linear-gradient(180deg, #ffffff 0, #f4f5fa 446px);
  .title-bar-sticky {
    .van-sticky--fixed {
      .title-bar {
        background: #ffffff;
      }
    }
  }
  .share-service-banner {
    width: 686px;
    height: 240px;
    margin: 0 auto;
    border-radius: 16px;
    overflow: hidden;
    :deep(.van-swipe__indicators) {
      bottom: 16px;
      .van-swipe__indicator {
        width: 8px;
        height: 8px;
        background: rgba(0, 0, 0, 0.16);
        margin-right: 12px;
        opacity: 1;
        &.van-swipe__indicator--active {
          background: #ff397e;
        }
      }
    }
  }
}
</style>
<style lang="scss">
html,
body {
  background: #f4f5fa;
}
</style>
