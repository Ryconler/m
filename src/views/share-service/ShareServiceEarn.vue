<template>
  <div class="share-service-earn">
    <VanTabs
      v-model:active="selectedTab"
      class="tabs sticky-fix"
      style="--fix-bg: #ffffff"
      :ellipsis="false"
      sticky
      shrink
      :offset-top="tabOffsetTop"
    >
      <ShareServiceEarnTabCZJ
        :position="position"
        :city-info="cityInfo"
        :all-recommend-spus="recommendSpus"
      ></ShareServiceEarnTabCZJ>
    </VanTabs>
  </div>
</template>
<script lang="ts" setup>
import { Tabs as VanTabs } from 'vant'
import { computed, PropType, ref, toRefs } from 'vue'
import ShareServiceEarnTabCZJ from './ShareServiceEarnTabCZJ.vue'
import { DefaultCity } from '@/constant/city'

const props = defineProps({
  position: {
    type: Object as PropType<any | null>,
    default() {
      return null
    }
  },
  cityInfo: {
    type: Object as PropType<any>,
    default() {
      return DefaultCity
    }
  },
  recommendSpus: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  }
})

const { recommendSpus } = toRefs(props)

const selectedTab = ref('')

const tabOffsetTop = computed(() => {
  const titleBarDom = document.getElementById('title-bar')
  return titleBarDom ? titleBarDom.getBoundingClientRect().height : 0
})
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
      $height: 116px,
      $padding: 0 32px,
      $background: transparent,
      $activeColor: #15161f,
      $activeSize: 34px,
      $inactiveColor: #999999,
      $inactiveSize: 28px,
      $lineWidth: 36px,
      $lineHeight: 6px,
      $lineBackground: #15161f,
      $lineBottom: 20px,
      $tabMargin: 0 40px 0 0
    );
  }
}
</style>
