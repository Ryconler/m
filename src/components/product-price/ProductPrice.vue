<template>
  <div class="product-price pf-medium">
    <span class="type">一口价</span>
    <span class="price">&yen;{{ getYenPrice(price) }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getYenPrice } from '@/utils'

export default defineComponent({
  props: {
    price: {
      type: Number,
      default: 0
    }
  },
  setup() {
    return {
      getYenPrice
    }
  }
})
</script>
<style lang="scss" scoped>
.product-price {
  color: #ff5900;
  display: flex;
  align-items: center;
  .type {
    font-size: 24px;
    line-height: 1;
    margin-right: 8px;
  }
  .price {
    font-size: 28px;
    line-height: 1;
  }
}
</style>
