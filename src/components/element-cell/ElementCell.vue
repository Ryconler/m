<template>
  <a class="element-cell" :href="element.link">
    <div class="element-info">
      <div class="element-title pf-medium">{{ element.title }}</div>
      <div class="element-extra">
        <div v-if="element.subTitle" class="element-sub-title">
          {{ element.subTitle }}
        </div>
        <ElementNum :num="element.minNum"></ElementNum>
      </div>
    </div>
    <div class="element-btn pf-medium">查看详情</div>
  </a>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Page1MinElementType } from '@/constant/page1'

export default defineComponent({
  props: {
    element: {
      type: Object as PropType<Page1MinElementType>,
      default() {
        return {}
      }
    }
  }
})
</script>
<style lang="scss">
.element-cell {
  width: 100%;
  padding: 20px 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow: hidden;
  .element-info {
    flex: 1;
    overflow: hidden;
    .element-title {
      color: #121212;
      font-size: 30px;
      line-height: 36px;
      padding-left: 40px;
      margin-bottom: 12px;
      background: url('@/assets/images/page1/icon-shangpin.png') left
        center/28px 28px no-repeat;
      @include ellicpsis;
    }
    .element-extra {
      display: flex;
      align-items: flex-end;
      @include ellicpsis;
      .element-sub-title {
        font-size: 20px;
        color: #444444;
        line-height: 1;
        margin-right: 20px;
      }
    }
  }
  .element-btn {
    flex: none;
    width: 208px;
    height: 72px;
    opacity: 0.9;
    background: linear-gradient(270deg, #ff5900, #ff8800);
    border-radius: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    line-height: 32px;
    font-size: 26px;
  }
}
</style>
