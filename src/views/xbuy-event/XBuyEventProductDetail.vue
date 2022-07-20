<template>
  <div v-if="eventInfo.content" class="xbuy-event-product-detail">
    <div class="detail-title pf-medium">商品详情</div>
    <div v-xhtml="eventInfo.content" class="detail-content"></div>
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
.xbuy-event-product-detail {
  padding: 28px 24px 32px;
  .detail-title {
    font-size: 30px;
    color: #121212;
    line-height: 40px;
    margin-bottom: 24px;
  }
  .detail-content {
    overflow-x: hidden;
    font-size: 28px;
    color: #666666;
    line-height: 40px;
    word-break: break-all;
    white-space: pre-wrap;
    :deep(*) {
      box-sizing: border-box;
    }
  }
}
</style>
