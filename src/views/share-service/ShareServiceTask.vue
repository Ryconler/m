<template>
  <div class="share-service-task">
    <div class="title">
      <i></i>
      <div class="title-text pf-medium">今日分享活动</div>
      <div class="more" @click="moreClick"></div>
    </div>
    <div class="task-list">
      <ShareServiceTaskItem
        v-for="(item, index) in tasks.slice(0, 4)"
        :key="index"
        class="task-item"
        :task="item"
        :slices="undefined"
        :city-id="cityInfo.cityId"
      ></ShareServiceTaskItem>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DefaultCity } from '@/constant/city'
import { ShareTaskType, TrackTerm } from '@/constant/shareService'
import { CityType } from '@/types/city'
import {} from '@/utils'
import { PropType, toRefs } from 'vue'
import ShareServiceTaskItem from './ShareServiceTaskItem.vue'

const props = defineProps({
  cityInfo: {
    type: Object as PropType<CityType>,
    default() {
      return DefaultCity
    }
  },
  tasks: {
    type: Array as PropType<ShareTaskType[]>,
    default() {
      return []
    }
  }
})

const { cityInfo, tasks } = toRefs(props)

const moreClick = () => {
  location.href = `/v2/share-service/task-list?cityId=${cityInfo.value.cityId}&kwtarget=blank`
}
</script>
<style lang="scss" scoped>
.share-service-task {
  .title {
    height: 88px;
    padding: 0 32px;
    display: flex;
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
    .more {
      flex: none;
      width: 80px;
      height: 36px;
      background: url('@/assets/images/share-service/icon-more.png') 0 0/100%
        100% no-repeat;
    }
  }
  .task-list {
    padding: 0 32px 8px;
    .task-item {
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
