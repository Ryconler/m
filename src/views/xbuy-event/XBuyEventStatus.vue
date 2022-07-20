<template>
  <div v-if="type" class="xbuy-event-status">
    <!-- 活动未开始 -->
    <div v-if="type == StatusShowType.EventUnstarted" class="event-unstarted">
      <div class="event-detail pf-medium">活动未开始</div>
      <div class="event-unstarted-time">{{ eventInfo.startTime }}开抢</div>
    </div>
    <!-- 助力进行中 -->
    <div v-else-if="type == StatusShowType.HelpOverview" class="event-sharing">
      <div class="event-title pf-medium">
        助力动态
        <div v-if="countdown" class="countdown">
          <strong>{{ countdown.hours }}</strong
          >时<strong>{{ countdown.minutes }}</strong
          >分<strong>{{ countdown.seconds }}</strong
          >秒后活动失效
        </div>
      </div>
      <div class="event-sharing-detail pf-medium">
        还需<strong>{{
          eventInfo.assistanceNum - eventInfo.hasAssistanceNum
        }}</strong
        >人助力成功，坚持就是胜利
      </div>
      <XBuyEventStatusProgress
        class="event-progress"
        :total="eventInfo.assistanceNum"
        :current="eventInfo.hasAssistanceNum"
      ></XBuyEventStatusProgress>
      <div class="event-button-color pf-medium" @click="toShare">
        邀请好友助力
      </div>
    </div>
    <!-- 助力成功 - 未购买 -->
    <div
      v-else-if="type == StatusShowType.Congratulation"
      class="event-successed"
    >
      <div class="event-title pf-medium">助力动态</div>
      <div class="event-detail pf-medium">恭喜您 助力成功</div>
      <XBuyEventStatusProgress
        class="event-progress"
        :total="eventInfo.assistanceNum"
        :current="eventInfo.hasAssistanceNum"
      ></XBuyEventStatusProgress>
      <div class="event-button-color pf-medium" @click="goPurchaseClick">
        ¥{{ eventInfo.promPrice }} 购买
      </div>
    </div>
    <!-- 助力成功 - 已购买 -->
    <div v-else-if="type == StatusShowType.Buyed" class="event-buyed">
      <div class="event-detail pf-medium">您已购买成功</div>
      <div class="event-button-plain pf-medium" @click="goOrderClick">
        查看订单
      </div>
    </div>
    <!-- 库存已没 - 未截止 -->
    <div
      v-else-if="type == StatusShowType.NoInventoryWithHelped"
      class="event-none"
    >
      <div class="event-detail gray pf-medium">库存已被抢完</div>
      <XBuyEventStatusProgress
        class="event-progress"
        gray
        :total="eventInfo.assistanceNum"
        :current="eventInfo.hasAssistanceNum"
      ></XBuyEventStatusProgress>
    </div>
    <!-- 库存已没 - 已截止 -->
    <div v-else-if="type == StatusShowType.NoInventory" class="event-none">
      <div class="event-detail gray pf-medium">库存已被抢完</div>
    </div>
    <!-- 活动结束 -->
    <div
      v-else-if="type == StatusShowType.FinishedWithHelped"
      class="event-finished"
    >
      <div class="event-detail gray pf-medium">活动已结束</div>
      <XBuyEventStatusProgress
        class="event-progress"
        gray
        :total="eventInfo.assistanceNum"
        :current="eventInfo.hasAssistanceNum"
      ></XBuyEventStatusProgress>
    </div>
    <!-- 活动结束 - 未参与 -->
    <div v-else-if="type == StatusShowType.Finished" class="event-finished">
      <div class="event-detail gray pf-medium">活动已结束</div>
    </div>
    <!-- 未完成助力 -->
    <div v-else-if="type == StatusShowType.Deadline" class="event-failed">
      <div class="event-detail gray pf-medium">规定时间内助力失败</div>
      <XBuyEventStatusProgress
        class="event-progress"
        gray
        :total="eventInfo.assistanceNum"
        :current="eventInfo.hasAssistanceNum"
      ></XBuyEventStatusProgress>
      <div class="event-button-color pf-medium" @click="reParticipateClick">
        重新发起助力
      </div>
    </div>
    <!-- 我也要抢 -->
    <div v-else-if="type == StatusShowType.Metoo" class="event-metoo">
      <div class="event-detail pf-medium">活动正在抢购中...</div>
      <div class="event-button-color pf-medium" @click="metooParticipateClick">
        我也要抢
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import { EventType, StatusShowType } from '@/constant/xbuyEvent'
import { onBeforeUnmount, PropType, Ref, ref, toRefs, watch } from 'vue'
import XBuyEventStatusProgress from './XBuyEventStatusProgress.vue'
import { toShare } from '@/composables/xbuy-event/common'
import {
  goOrder,
  goPurchase,
  metooParticipate,
  reParticipate
} from '@/composables/xbuy-event/common'

dayjs.extend(customParseFormat)
dayjs.extend(duration)

const props = defineProps({
  eventInfo: {
    type: Object as PropType<EventType>,
    default() {
      return {}
    }
  },
  skuDetail: {
    type: Object as PropType<any>,
    default() {
      return {}
    }
  },
  type: {
    type: Number as PropType<StatusShowType>,
    default: StatusShowType.Unknown
  }
})
const { eventInfo, skuDetail, type } = toRefs(props)

const countdown: Ref<{
  hours: string
  minutes: string
  seconds: string
} | null> = ref(null)
let nowTime = Date.now()
let interval: any = null
watch(type, val => {
  if (val) {
    nowTime = dayjs(eventInfo.value.currTime, 'YYYY-MM-DD HH:mm:ss').valueOf()
    interval && clearInterval(interval)
    interval = setInterval(() => {
      nowTime += 1000
      setCountdown()
    }, 1000)
    setCountdown()
  }
})
onBeforeUnmount(() => {
  interval && clearInterval(interval)
})
function setCountdown() {
  const partTime = dayjs(
    eventInfo.value.shareTime,
    'YYYY-MM-DD HH:mm:ss'
  ).valueOf()
  const endTime = dayjs(
    eventInfo.value.endTime,
    'YYYY-MM-DD HH:mm:ss'
  ).valueOf()
  const deadline = Math.min(
    partTime + eventInfo.value.activityTime * 3600 * 1000,
    endTime
  )
  const diffTime = Math.max(deadline - nowTime, 0)
  const diffDayjs = dayjs.duration(diffTime)
  const hours = diffDayjs.hours()
  const minutes = diffDayjs.minutes()
  const seconds = diffDayjs.seconds()
  countdown.value = {
    hours: hours < 10 ? `0${hours}` : `${hours}`,
    minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
    seconds: seconds < 10 ? `0${seconds}` : `${seconds}`
  }
}

const goPurchaseClick = () => {
  goPurchase(eventInfo.value, skuDetail.value)
}

const goOrderClick = () => {
  goOrder(eventInfo.value)
}

const reParticipateClick = () => {
  reParticipate(eventInfo.value)
}

const metooParticipateClick = () => {
  metooParticipate(eventInfo.value)
}
</script>
<style lang="scss" scoped>
.xbuy-event-status {
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 28px 24px 36px;
    box-sizing: border-box;
  }
}
.event-unstarted {
  height: 310px;
  .event-detail {
    margin-bottom: 16px;
  }
  .event-unstarted-time {
    font-size: 30px;
    color: #333333;
    line-height: 40px;
  }
}
.event-sharing {
  .event-title {
    margin-bottom: 32px;
  }
  .event-sharing-detail {
    font-size: 28px;
    color: #333333;
    line-height: 40px;
    margin-bottom: 24px;
    strong {
      font-size: 36px;
      color: #ff5900;
      margin: 0 12px;
    }
  }
  .event-progress {
    margin-bottom: 24px;
  }
}
.event-successed {
  .event-title {
    margin-bottom: 24px;
  }
  .event-detail {
    margin-bottom: 24px;
  }
  .event-progress {
    margin-bottom: 24px;
  }
}
.event-buyed {
  height: 310px;
  .event-detail {
    margin-bottom: 62px;
  }
}
.event-none {
  height: 310px;
  .event-detail {
    margin-bottom: 24px;
  }
  & > div:last-child {
    margin-bottom: 0;
  }
}
.event-finished {
  height: 310px;
  .event-detail {
    margin-bottom: 24px;
  }
  & > div:last-child {
    margin-bottom: 0;
  }
}
.event-failed {
  height: 410px;
  .event-detail {
    margin-bottom: 24px;
  }
  .event-progress {
    margin-bottom: 24px;
  }
}
.event-metoo {
  height: 310px;
  .event-detail {
    margin-bottom: 58px;
  }
}

/* common */
.event-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30px;
  color: #121212;
  line-height: 40px;
  .countdown {
    font-weight: normal;
    font-size: 22px;
    color: #999999;
    line-height: 36px;
    strong {
      display: inline-block;
      width: 36px;
      height: 36px;
      text-align: center;
      color: #ffffff;
      background: #ff611d;
      border-radius: 4px;
      margin: 0 4px;
    }
  }
}
.event-detail {
  font-size: 34px;
  color: #ff5b01;
  line-height: 48px;
  &.gray {
    color: #999999;
  }
}
.event-progress {
  width: 600px;
}
.event-button-color {
  box-sizing: border-box;
  width: 400px;
  height: 100px;
  background: url(@/assets/images/xbuy-event/bg-button-400.png) 0 0 /100% 100% no-repeat;
  font-size: 30px;
  color: #ffffff;
  text-align: center;
  padding-top: 20px;
  line-height: 40px;
}
.event-button-plain {
  box-sizing: border-box;
  width: 400px;
  height: 84px;
  border: 1px solid rgba(151, 151, 151, 1);
  border-radius: 84px;
  margin: 0 auto;
  font-size: 30px;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
