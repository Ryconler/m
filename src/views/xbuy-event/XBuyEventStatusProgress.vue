<template>
  <div class="progress" :class="{ gray }">
    <div
      class="porgress-rate-num"
      :style="{ left: `${Math.min(100 * (current / total), 100)}%` }"
    >
      {{ current }}人
    </div>
    <div class="progress-graph">
      <div
        class="progress-rate-graph"
        :style="{ width: `${Math.min(100 * (current / total), 100)}%` }"
      ></div>
    </div>
    <div class="porgress-total">
      <span>0人</span>
      <span>{{ total }}人</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  total: {
    type: Number,
    default: 10
  },
  current: {
    type: Number,
    default: 0
  },
  gray: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="scss" scoped>
.progress {
  padding-top: 50px;
  position: relative;
  .porgress-rate-num {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-50%);
    width: 64px;
    height: 42px;
    background: url(@/assets/images/xbuy-event/bg-progress-num.png) 0 0/100%
      100% no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
    box-sizing: border-box;
    color: #ffffff;
    font-size: 22px;
  }
  .progress-graph {
    height: 24px;
    background: #fff5f1;
    border-radius: 24px;
    margin-bottom: 8px;
    .progress-rate-graph {
      width: 10%;
      height: 24px;
      background-image: linear-gradient(270deg, #fc3e17 0%, #ffaa11 100%);
      border-radius: 24px;
    }
  }
  .porgress-total {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
    color: #ff5900;
    line-height: 28px;
  }
}
.progress.gray {
  .porgress-rate-num {
    background: url(@/assets/images/xbuy-event/bg-progress-num-gray.png) 0 0/100%
      100% no-repeat;
  }
  .progress-graph {
    background: #eeeeee;
    .progress-rate-graph {
      background: #cccccc;
    }
  }
  .porgress-total {
    color: #666666;
  }
}
</style>
