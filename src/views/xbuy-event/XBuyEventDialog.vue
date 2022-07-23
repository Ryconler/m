<template>
  <VanOverlay class="xbuy-event-dialog" :show="!!modelValue">
    <div v-if="modelValue" class="dialog">
      <div v-if="modelValue == DialogShowType.HZWFirstHelp" class="dialog-wrap">
        <div class="dialog-wrap-message pf-medium">
          孩子王已经帮您助力一次，还需{{
            eventInfo.assistanceNum - eventInfo.hasAssistanceNum
          }}人帮您助力
        </div>
        <div class="dialog-wrap-button-268 pf-medium" @click="toShare">
          邀请好友助力
        </div>
      </div>
      <div
        v-else-if="modelValue == DialogShowType.HelpOverview"
        class="dialog-wrap"
      >
        <div class="dialog-wrap-message pf-medium">
          已有{{ eventInfo.hasAssistanceNum }}人帮您助力，还需{{
            eventInfo.assistanceNum - eventInfo.hasAssistanceNum
          }}人即可助力成功
        </div>
        <div class="dialog-wrap-button-268 pf-medium" @click="toShare">
          邀请好友助力
        </div>
      </div>
      <div
        v-else-if="modelValue == DialogShowType.Congratulation"
        class="dialog-wrap"
      >
        <div class="dialog-wrap-message pf-medium">恭喜您助力成功</div>
        <div class="dialog-wrap-button-268 pf-medium" @click="goPurchaseClick">
          ¥{{ eventInfo.promPrice }} 购买
        </div>
      </div>
      <div
        v-else-if="modelValue == DialogShowType.HelpSuccess"
        class="dialog-wrap"
      >
        <div class="dialog-wrap-message pf-medium">
          您已帮【{{ sharerName }}】助力成功
        </div>
        <div class="dialog-wrap-button-228 pf-medium" @click="closeClick">
          好的
        </div>
      </div>
      <div
        v-else-if="modelValue == DialogShowType.EventHasSuccess"
        class="dialog-wrap"
      >
        <div class="dialog-wrap-message pf-medium">您的好友已完成助力</div>
        <div
          class="dialog-wrap-button-228 pf-medium"
          @click="metooParticipateClick"
        >
          我也要抢
        </div>
      </div>
      <div
        v-else-if="modelValue == DialogShowType.HelpRepeat"
        class="dialog-wrap failed"
      >
        <div class="dialog-wrap-message pf-medium">
          您已帮【{{ sharerName }}】助力过
        </div>
        <div class="dialog-wrap-button-228 pf-medium" @click="closeClick">
          好的
        </div>
      </div>
      <div
        v-else-if="modelValue == DialogShowType.HelpLimit"
        class="dialog-wrap failed"
      >
        <div class="dialog-wrap-message pf-medium">今日助力已达上限</div>
        <div class="dialog-wrap-button-228 pf-medium" @click="closeClick">
          好的
        </div>
      </div>
      <div
        v-else-if="modelValue == DialogShowType.EventInvalid"
        class="dialog-wrap failed"
      >
        <div class="dialog-wrap-message pf-medium">该助力活动已失效</div>
        <div class="dialog-wrap-button-228 pf-medium" @click="closeClick">
          好的
        </div>
      </div>
      <div
        v-else-if="modelValue == DialogShowType.OtherMsg && eventInfo.helpMsg"
        class="dialog-wrap failed"
      >
        <div class="dialog-wrap-message pf-medium">{{ eventInfo.helpMsg }}</div>
        <div class="dialog-wrap-button-228 pf-medium" @click="closeClick">
          好的
        </div>
      </div>
      <div class="dialog-close" @click="closeClick"></div>
    </div>
  </VanOverlay>
</template>
<script lang="ts" setup>
import { DialogShowType, EventType } from '@/constant/xbuyEvent'
import { computed, PropType, toRefs } from 'vue'
import {
  toShare,
  metooParticipate,
  goPurchase
} from '@/composables/xbuy-event/common'
import { useRoute } from 'vue-router'

const emit = defineEmits(['update:modelValue'])

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
  modelValue: {
    type: Number as PropType<DialogShowType>,
    default: DialogShowType.None
  }
})
const { eventInfo, skuDetail } = toRefs(props)

const route = useRoute()

const sharerName = computed(() => {
  return decodeURIComponent(<string>(route.query.sharerName || ''))
})

const goPurchaseClick = () => {
  goPurchase(eventInfo.value, skuDetail.value)
}

const metooParticipateClick = () => {
  metooParticipate(eventInfo.value)
}

const closeClick = () => {
  emit('update:modelValue', DialogShowType.None)
}
</script>
<style lang="scss" scoped>
.xbuy-event-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog {
  margin-bottom: 100px;
  .dialog-wrap {
    box-sizing: border-box;
    width: 586px;
    height: 620px;
    background: url(@/assets/images/xbuy-event/bg-dialog-success.png) 0 0/100%
      100% no-repeat;
    padding: 276px 44px 0;
    &.failed {
      background: url(@/assets/images/xbuy-event/bg-dialog-fail.png) 0 0/100%
        100% no-repeat;
    }
    .dialog-wrap-message {
      height: 168px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      color: #5a2005;
      text-align: center;
      line-height: 44px;
    }
    .dialog-wrap-button-268 {
      box-sizing: border-box;
      width: 268px;
      height: 100px;
      background: url(@/assets/images/xbuy-event/bg-button-268.png) 0 0 /100% 100%
        no-repeat;
      font-size: 30px;
      color: #ffffff;
      text-align: center;
      padding-top: 20px;
      line-height: 40px;
      margin: 24px auto 0;
    }
    .dialog-wrap-button-228 {
      box-sizing: border-box;
      width: 228px;
      height: 100px;
      background: url(@/assets/images/xbuy-event/bg-button-268.png) 0 0 /100% 100%
        no-repeat;
      font-size: 30px;
      color: #ffffff;
      text-align: center;
      padding-top: 20px;
      line-height: 40px;
      margin: 24px auto 0;
    }
  }
  .dialog-close {
    width: 64px;
    height: 64px;
    background: url(@/assets/images/xbuy-event/icon-dialog-close.png) 0 0/100%
      100% no-repeat;
    margin: 44px auto 0;
  }
}
</style>
