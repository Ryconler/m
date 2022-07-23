<template>
  <div class="share-service">
    <TitleBar2
      :city-name="cityInfo.cityName"
      citypicker="party"
      placeholder="请输入想要分享的商品"
      class="title-bar-comp"
    >
    </TitleBar2>
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
      :city-info="cityInfo"
      :tasks="shareTasks"
    ></ShareServiceTask>
    <ShareServiceEarn
      v-if="shareTasksLoaded && locationLoaded"
      class="share-service-earn-comp"
      :position="position"
      :city-info="cityInfo"
      :districts="districts"
      :recommend-spus="recommendSpus"
    ></ShareServiceEarn>
  </div>
</template>
<script lang="ts" setup>
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem, Toast } from 'vant'
import { ensureLogin, getKwtargetUrl, setLoading } from '@/utils'
import { useLocation } from '@/composables/common'
import ShareServiceTask from './ShareServiceTask.vue'
import ShareServiceEarn from './ShareServiceEarn.vue'
import { nextTick, onMounted, provide, Ref, ref } from 'vue'
import { ShareTaskType, TrackTerm } from '@/constant/shareService'
import { getRecruitInfo, queryShareTask } from '@/api/shareService'
import { useRouter } from 'vue-router'
import { useShareMain } from '@/composables/share-service/common'

setLoading(true)

const router = useRouter()

const { position, cityInfo, districts, locationLoaded } = useLocation({
  districts: true
})
const banners: Ref<{ rotationPic: string; jumpUrl: string }[]> = ref([])
const shareTasks: Ref<ShareTaskType[]> = ref([])
const shareTasksLoaded = ref(false)

const { recommendSpus } = useShareMain(cityInfo)

onMounted(async () => {
  const { rotationPicList, shareTaskList } = await queryShareTask(
    cityInfo.value.cityId
  )
  banners.value = rotationPicList || []
  shareTasks.value = shareTaskList || []
  nextTick(() => {
    shareTasksLoaded.value = true
  })
  setLoading(false)
})

const myEarnClick = () => {
  const link =
    'https://life.cekid.com/h5/user/commission?cmd=share&sharetype=0&refresh=no'
  location.href = link + '&kwtarget=blank'
}

const bannerClick = (banner: any) => {
  location.href = getKwtargetUrl(banner.jumpUrl)
}
</script>
<style lang="scss" scoped>
.share-service {
  background-image: linear-gradient(180deg, #ffffff 0, #f4f5fa 446px);
  .title-bar-comp .my-earn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    height: 54px;
    margin-left: 22px;
    background-image: linear-gradient(0deg, #ff7d46, #ff4b4b);
    border-radius: 27px;
    i {
      width: 40px;
      height: 40px;
      background: url(@/assets/images/share-service/icon-coin.png) 0 0/100% 100%
        no-repeat;
    }
    span {
      color: #ffffff;
      font-size: 26px;
    }
  }
  .share-service-banner {
    width: 686px;
    height: 240px;
    margin: 0 auto 16px;
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
