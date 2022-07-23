<template>
  <div class="xbuy-event" :style="{ paddingTop: `${paddingTop}px` }">
    <XBuyEventHeader
      class="xbuy-event-item"
      :event-info="eventInfo"
    ></XBuyEventHeader>
    <XBuyEventStatus
      class="xbuy-event-item"
      :event-info="eventInfo"
      :type="statusShowType"
      :sku-detail="skuDetail"
    ></XBuyEventStatus>
    <XBuyEventRecord
      v-if="isSharer"
      class="xbuy-event-item"
      :event-info="eventInfo"
    ></XBuyEventRecord>
    <XBuyEventPlayRule
      v-if="eventInfo.id"
      class="xbuy-event-item"
    ></XBuyEventPlayRule>
    <XBuyEventTextRule
      class="xbuy-event-item"
      :event-info="eventInfo"
    ></XBuyEventTextRule>
    <XBuyEventProductDetail
      class="xbuy-event-item"
      :event-info="eventInfo"
    ></XBuyEventProductDetail>

    <div class="menu_wkBox_back_box"></div>

    <VanOverlay
      class="launch-app-overlay"
      :show="launchAppShow"
      @click="launchAppShow = false"
    >
      <div class="launch-app" @click="e => e.stopPropagation()">
        <p>请前往孩子王APP查看助力进度</p>
        <a :href="lauchAppUrl" @click="launchAppShow = false">打开孩子王APP</a>
      </div>
    </VanOverlay>

    <XBuyEventDialog
      v-model="dialogShowType"
      :event-info="eventInfo"
      :sku-detail="skuDetail"
    ></XBuyEventDialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, Ref } from 'vue'
import { setLoading } from '@/utils'
import XBuyEventHeader from './XBuyEventHeader.vue'
import XBuyEventStatus from './XBuyEventStatus.vue'
import XBuyEventRecord from './XBuyEventRecord.vue'
import XBuyEventPlayRule from './XBuyEventPlayRule.vue'
import XBuyEventTextRule from './XBuyEventTextRule.vue'
import XBuyEventProductDetail from './XBuyEventProductDetail.vue'
import XBuyEventDialog from './XBuyEventDialog.vue'
import {
  DialogShowConditions,
  DialogShowType,
  EventStatus,
  EventType,
  getConsResult,
  HelpResult,
  ShareStatus,
  StatusShowConditions,
  StatusShowType
} from '@/constant/xbuyEvent'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { helpEvent, participateEvent, queryEventInfo } from '@/api/xbuyEvent'
import qs from 'query-string'
import { isEmpty } from 'lodash'
import jsCookie from 'js-cookie'

setLoading(true)

const route = useRoute()
const router = useRouter()
const store = useStore()

const uid = jsCookie.get('uid') || ''

const paddingTop = computed(() => {
  return 0
})

const launchAppShow = ref(false)
const lauchAppUrl = computed(() => {
  const urlObj = qs.parseUrl(location.href.replace(/^http(s?):/, 'kidswant:'))
  urlObj.query.naviType = '3'
  return qs.stringifyUrl(urlObj)
})

const eventInfo: Ref<EventType> = ref(<EventType>{})
const skuDetail: Ref<any> = ref({})
const statusShowType: Ref<StatusShowType> = ref(StatusShowType.Unknown)
const dialogShowType: Ref<DialogShowType> = ref(DialogShowType.None)
const userInfo: Ref<any> = ref(null)
const sharerUid = ref(route.query.sharerUid ? `${route.query.sharerUid}` : '') //url参数上的活动分享人uid
const isSharer = ref(true || !sharerUid.value || sharerUid.value == uid) //活动访问者身份：参与人
const isHelper = ref(!!sharerUid.value && sharerUid.value != uid) //活动访问者身份：助力人

onMounted(async () => {
  userInfo.value = await store.dispatch('queryUserInfo')

  const eventId = route.params.eventId
  const skuId = route.query.skuId

  eventInfo.value = await queryEventInfo(Number(eventId), Number(skuId))
  if (isSharer.value) {
    /* 分享人处理逻辑 */
    if (
      eventInfo.value.status == EventStatus.Inprogress &&
      eventInfo.value.shareStatus == ShareStatus.Unshared
    ) {
      //自动参与活动
      setTimeout(async () => {
        await participateEvent(eventInfo.value.id, eventInfo.value.skuId)
        eventInfo.value = await queryEventInfo(Number(eventId), Number(skuId))
        //孩子王自动助力
        if (eventInfo.value.hasAssistanceNum == 1) {
          eventInfo.value.hzwFirstHelp = true
        }
        setStatusShowType()
        setDialogShowType()
        await querySkuDetail()
      })
    }
  } else if (isHelper.value) {
    /* 助力人处理逻辑 */
    if (eventInfo.value.status == EventStatus.Inprogress) {
      //自动助力
      setTimeout(async () => {
        const { code, msg } = await helpEvent(
          eventInfo.value.id,
          eventInfo.value.skuId,
          sharerUid.value
        )
        eventInfo.value.helpResult = <HelpResult>(<unknown>code)
        eventInfo.value.helpMsg = msg
        setStatusShowType()
        setDialogShowType()
      })
    }
  }
  setStatusShowType()
  setDialogShowType()
  await querySkuDetail()
  setLoading(false)
})

/* 设置XBuyEventStatus的显示 */
function setStatusShowType() {
  eventInfo.value.isSharer = isSharer.value
  eventInfo.value.isHelper = isHelper.value
  const result = getConsResult<StatusShowType>(
    eventInfo.value,
    StatusShowConditions
  )
  if (result) {
    statusShowType.value = result.value
  }
}

/* 设置XBuyEventDialog的显示 */
function setDialogShowType() {
  eventInfo.value.isSharer = isSharer.value
  eventInfo.value.isHelper = isHelper.value
  const result = getConsResult<DialogShowType>(
    eventInfo.value,
    DialogShowConditions
  )
  if (result) {
    dialogShowType.value = result.value
  } else if (eventInfo.value.helpMsg) {
    dialogShowType.value = DialogShowType.OtherMsg
  }
}

/* 助力成功，查询商品更多的详细信息，下单时用 */
async function querySkuDetail() {
  if (
    isEmpty(skuDetail.value) &&
    (statusShowType.value == StatusShowType.Congratulation ||
      dialogShowType.value == DialogShowType.Congratulation)
  ) {
    const { skuId, spuId } = eventInfo.value
  }
}
</script>
<style lang="scss" scoped>
.xbuy-event {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 0 24px 18px;
  background: url(@/assets/images/xbuy-event/bg-event.png) 0 0/100% 660px
    no-repeat;
  background-color: #ffc97a;
  &::before {
    content: '';
    display: block;
    height: 18px;
  }
  .xbuy-event-item {
    background: #ffffff;
    box-shadow: inset 0px 0px 16px 0px rgba(255, 225, 170, 1);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .xbuy-event-item:last-of-type {
    margin-bottom: 0;
  }
}

.launch-app-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  .launch-app {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 560px;
    text-align: center;
    border-radius: 16px;
    padding: 90px 0 60px;
    background: #ffffff;
    p {
      font-size: 30px;
      color: #121212;
      margin-bottom: 75px;
    }
    a {
      width: 430px;
      height: 80px;
      line-height: 80px;
      background-image: linear-gradient(90deg, #ff7d46 0%, #ff6060 100%);
      border-radius: 40px;
      font-size: 32px;
      color: #ffffff;
    }
  }
}
</style>
