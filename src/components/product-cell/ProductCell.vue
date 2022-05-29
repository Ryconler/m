<template>
  <a class="product-cell" :href="productUrl">
    <div class="product-info">
      <div class="product-title pf-medium">{{ productInfo.spuName }}</div>
      <div class="product-extra">
        <div
          v-if="
            productInfo.photoNum &&
            productInfo.photeRepairNum &&
            productInfo.photoNum >= 0 &&
            productInfo.photeRepairNum >= 0
          "
          class="product-photonum"
        >
          拍摄≥{{ productInfo.photoNum }}张 |
          {{ productInfo.photeRepairNum }}张精修
        </div>
        <ProductPrice :price="productInfo.price"></ProductPrice>
      </div>
    </div>
    <div class="product-btn pf-medium">查看详情</div>
  </a>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from 'vue'

export default defineComponent({
  props: {
    productInfo: {
      type: Object as PropType<any>,
      default() {
        return {}
      }
    }
  },
  setup(props: any) {
    const productUrl = ref('')
    watchEffect(() => {
      productUrl.value = ``
    })

    return { productUrl }
  }
})
</script>
<style lang="scss">
.product-cell {
  width: 100%;
  padding: 20px 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow: hidden;
  .product-info {
    flex: 1;
    overflow: hidden;
    .product-title {
      color: #121212;
      font-size: 30px;
      line-height: 36px;
      padding-left: 40px;
      margin-bottom: 12px;
      background: url('@/assets/images/photography/icon-shangpin.png') left
        center/28px 28px no-repeat;
      @include ellicpsis;
    }
    .product-extra {
      display: flex;
      align-items: flex-end;
      @include ellicpsis;
      .product-photonum {
        font-size: 20px;
        color: #444444;
        line-height: 1;
        margin-right: 20px;
      }
    }
  }
  .product-btn {
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
