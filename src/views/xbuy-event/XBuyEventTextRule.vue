<template>
  <div v-if="eventInfo.activityRule" class="xbuy-event-text-rule">
    <div class="rule-title pf-medium">活动规则</div>
    <div class="rule-content">
      {{ eventInfo.activityRule }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EventType } from '@/constant/xbuyEvent'
import { PropType } from 'vue'

defineProps({
  eventInfo: {
    type: Object as PropType<EventType>,
    default() {
      return {}
    }
  }
})
</script>
<style lang="scss" scoped>
.xbuy-event-text-rule {
  padding: 28px 24px 32px;
  .rule-title {
    font-size: 30px;
    color: #121212;
    line-height: 40px;
    margin-bottom: 24px;
  }
  .rule-content {
    font-size: 28px;
    color: #666666;
    line-height: 40px;
    word-break: break-all;
    white-space: pre-wrap;
  }
}
</style>
