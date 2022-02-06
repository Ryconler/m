<template>
  <div class="element-num pf-medium">
    <span class="type">一口价</span>
    <span class="num">{{ num }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    num: {
      type: Number,
      default: 0
    }
  }
})
</script>
<style lang="scss" scoped>
.element-num {
  color: #ff5900;
  display: flex;
  align-items: center;
  .type {
    font-size: 24px;
    line-height: 1;
    margin-right: 8px;
  }
  .num {
    font-size: 28px;
    line-height: 1;
  }
}
</style>
