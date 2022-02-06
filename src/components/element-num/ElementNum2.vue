<template>
  <div class="element-num">
    <span class="num pf-medium">{{ minNum }}</span>
    <span v-if="minNum < maxNum" class="qi">起</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    minNum: {
      type: Number,
      default: 0
    },
    maxNum: {
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
  height: 42px;
  .num {
    font-size: 34px;
    margin-right: 4px;
    padding-bottom: 4px;
  }
  .qi {
    font-size: 24px;
  }
}
</style>
