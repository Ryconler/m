<template>
  <div v-if="showedRecords.length > 0" class="xbuy-event-record">
    <div class="record-title pf-medium">助力记录</div>
    <ul class="record-users">
      <li
        v-for="(item, index) in showedRecords"
        :key="index"
        class="record-user"
      >
        <BaseImg
          class="record-user-avatar"
          :src="item.bePhoto"
          width="48"
          height="48"
        />
        <div class="record-user-name">{{ item.beNickname }}</div>
        <div class="record-user-time">{{ getHelpTime(item.beShareTime) }}</div>
      </li>
      <div
        v-if="allRecords.length != showedRecords.length && !allShow"
        class="record-all"
        @click="viewAllClick"
      >
        查看全部<i></i>
      </div>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { EventType, ShareStatus } from '@/constant/xbuyEvent'
import { computed, PropType, ref, toRefs } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const props = defineProps({
  eventInfo: {
    type: Object as PropType<EventType>,
    default() {
      return {}
    }
  }
})
const { eventInfo } = toRefs(props)

const allRecords = computed(() => {
  return eventInfo.value.assistanceList
    ? eventInfo.value.assistanceList.filter(
        item => item.beStatus == ShareStatus.ShareSuccessed
      )
    : []
})
const showedRecords = computed(() => {
  if (allShow.value) {
    return allRecords.value
  } else {
    return allRecords.value.slice(0, 2)
  }
})

const getHelpTime = (timestr: string) => {
  const helpTime = dayjs(timestr, 'YYYY-MM-DD HH:mm:ss')
  return helpTime.format('MM-DD HH:mm')
}

const allShow = ref(false)

const viewAllClick = () => {
  allShow.value = !allShow.value
}
</script>
<style lang="scss" scoped>
.xbuy-event-record {
  padding: 28px 24px 0;
  .record-title {
    font-size: 30px;
    color: #121212;
    line-height: 40px;
    margin-bottom: 20px;
  }
  ul.record-users {
    li.record-user {
      height: 88px;
      display: flex;
      align-items: center;
      border-bottom: 2px solid #eeeeee;
      .record-user-avatar {
        flex: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        overflow: hidden;
        margin-right: 20px;
        border: 2px solid rgba(252, 221, 174, 1);
      }
      .record-user-name {
        flex: 1;
        font-size: 28px;
        color: #262626;
        line-height: 40px;
        @include ellipsis;
      }
      .record-user-time {
        flex: none;
        font-size: 28px;
        color: #666666;
      }
    }
    /* 最后一个li不要下边框 */
    li:last-of-type {
      border: none;
    }
    /* 无显示全部按钮，li是最后一个元素，底部加上边距 */
    li:last-child {
      margin-bottom: 28px;
    }
    /* 显示全部按钮 */
    .record-all {
      height: 72px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: #333333;
      border-top: 2px solid #eeeeee;
      i {
        width: 16px;
        height: 16px;
        margin-left: 6px;
        background: url(@/assets/images/xbuy-event/icon-down.png) 0 0/100% 100%
          no-repeat;
      }
    }
  }
}
</style>
