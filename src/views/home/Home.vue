<template>
  <div class="home">
    <VanSticky class="sticky-fix" style="--fix-bg: #ffffff">
      <TitleBar
        :city-name="cityInfo.cityName"
        citypicker="party"
        class="title-bar-wrap"
      >
        <!-- <a class="avatar-btn" @click="avatarClick">
          <i class="avatar-icon"></i>
        </a> -->
      </TitleBar>
    </VanSticky>
    <HomeMain v-if="locationLoaded" :city-info="cityInfo"></HomeMain>
    <HomeTabs
      v-if="locationLoaded"
      :location="location"
      :city-info="cityInfo"
      :districts="districts"
    ></HomeTabs>
  </div>
</template>
<script lang="ts" setup>
import { Sticky as VanSticky } from 'vant'
import { getLocationData, getAvatar } from '@/composables/home/home'
import HomeMain from './HomeMain.vue'
import HomeTabs from './HomeTabs.vue'
import { useStore } from 'vuex'

const store = useStore()

store.dispatch('queryUserInfo')

const { location, cityInfo, districts, locationLoaded } = getLocationData()

const { avatarClick } = getAvatar()
</script>
<style lang="scss" scoped>
.home {
  .title-bar-wrap {
    .avatar-btn {
      display: flex;
      align-items: center;
      .avatar-icon {
        width: 44px;
        height: 44px;
        background: url('@/assets/images/home/icon-avatar.png') 0 0/100% 100%
          no-repeat;
      }
    }
  }
}
</style>
