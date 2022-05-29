<template>
  <div
    class="share-earn"
    :class="{ 'has-tabbar': $route.query.showTabbar == '1' }"
  >
    <VanSticky class="sticky-fix" style="--fix-bg: #ffffff">
      <TitleBar
        :city-name="cityInfo.cityName"
        citypicker="party"
        class="title-bar-wrap"
      >
        <a class="list-btn" @click="listBtnClick">
          <i class="list-icon"></i>
          <span>清单</span>
        </a>
      </TitleBar>
    </VanSticky>
    <ShareEarnMain :city-info="cityInfo"></ShareEarnMain>
    <ShareEarnTabs
      v-if="locationLoaded"
      :position="position"
      :city-info="cityInfo"
    ></ShareEarnTabs>
    <div class="menu_wkBox_back_box"></div>
  </div>
</template>
<script lang="ts" setup>
import { Sticky as VanSticky } from 'vant'
import ShareEarnMain from './ShareEarnMain.vue'
import ShareEarnTabs from './ShareEarnTabs.vue'
import { getLocation } from '@/composables/common'
import { useRouter } from 'vue-router'

const { position, cityInfo, locationLoaded } = getLocation()

const router = useRouter()

const listBtnClick = () => {
  router.push({
    name: 'shareList'
  })
}
</script>
<style lang="scss" scoped>
.share-earn {
  .title-bar-wrap {
    .list-btn {
      display: flex;
      align-items: center;
      margin-left: 12px;
      .list-icon {
        width: 35px;
        height: 35px;
        background: url('@/assets/images/share-earn/icon-list.png') 0 0/100%
          100% no-repeat;
        margin-right: 12px;
      }
      span {
        font-size: 26px;
        color: #262626;
      }
    }
  }
}
.share-earn.has-tabbar {
  padding-bottom: 98px;
}
</style>
