<template>
  <div class="share-service-earn">
    <VanTabs
      v-model:active="selectedTab"
      class="tabs"
      style="--fix-bg: #ffffff"
      :ellipsis="false"
      sticky
      shrink
      :offset-top="tabOffsetTop"
      @click-tab="tabClick"
    >
      <ShareServiceEarnTabYC
        :position="position"
        :city-info="cityInfo"
        :districts="districts"
        :all-recommend-spus="recommendSpus"
      ></ShareServiceEarnTabYC>
      <ShareServiceEarnTabCZJ
        :position="position"
        :city-info="cityInfo"
        :districts="districts"
        :all-recommend-spus="recommendSpus"
      ></ShareServiceEarnTabCZJ>
      <ShareServiceEarnTabZYFW
        :position="position"
        :city-info="cityInfo"
        :all-recommend-spus="recommendSpus"
      ></ShareServiceEarnTabZYFW>
      <ShareServiceEarnTabHD
        :position="position"
        :city-info="cityInfo"
      ></ShareServiceEarnTabHD>
      <ShareServiceEarnTabBX></ShareServiceEarnTabBX>
    </VanTabs>
  </div>
</template>
<script lang="ts" setup>
import { Tabs as VanTabs } from 'vant'
import {} from '@/utils'
import { computed, PropType, ref, toRefs } from 'vue'
import ShareServiceEarnTabYC from './ShareServiceEarnTabYC.vue'
import ShareServiceEarnTabCZJ from './ShareServiceEarnTabCZJ.vue'
import ShareServiceEarnTabZYFW from './ShareServiceEarnTabZYFW.vue'
import ShareServiceEarnTabHD from './ShareServiceEarnTabHD.vue'
import ShareServiceEarnTabBX from './ShareServiceEarnTabBX.vue'
import { ShareSpuType, TrackTerm } from '@/constant/shareService'
import { PositionType } from '@/types/position'
import { CityType } from '@/types/city'
import { DistrictType } from '@/types/classifySort'
import { DefaultCity } from '@/constant/city'

const props = defineProps({
  position: {
    type: Object as PropType<PositionType | null>,
    default() {
      return null
    }
  },
  cityInfo: {
    type: Object as PropType<CityType>,
    default() {
      return DefaultCity
    }
  },
  districts: {
    type: Array as PropType<DistrictType[]>,
    default() {
      return []
    }
  },
  recommendSpus: {
    type: Array as PropType<ShareSpuType[]>,
    default() {
      return []
    }
  }
})

const { recommendSpus } = toRefs(props)

const selectedTab = ref('')

const tabOffsetTop = computed(() => {
  return 0
})

const tabClick = ({ title = '' }) => {}
</script>
<style lang="scss" scoped>
.share-service-earn {
  .title {
    box-sizing: border-box;
    height: 80px;
    display: flex;
    padding: 40px 32px 0;
    align-items: center;
    i {
      width: 8px;
      height: 28px;
      background: #ff397e;
      border-radius: 4px;
      margin-right: 16px;
      flex: none;
    }
    .title-text {
      font-size: 32px;
      color: #15161f;
      flex: 1;
    }
  }
  .tabs {
    @include vanTab(
      $height: 84px,
      $padding: 0 32px,
      $background: transparent,
      $activeColor: #ff397e,
      $activeSize: 30px,
      $inactiveColor: #15161f,
      $inactiveSize: 30px,
      $tabMargin: 0 40px 0 0
    );
    :deep(.van-tabs__line) {
      display: none;
    }
    :deep(.van-tab__text) {
      font-weight: 500 !important;
    }
  }
}
</style>
