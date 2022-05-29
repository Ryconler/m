<template>
  <div class="product-price">
    <span class="type">&yen;</span>
    <span class="price pf-medium">{{ getYenPrice(price) }}</span>
    <span v-if="price < maxPrice" class="qi">起</span>
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
    },
    maxPrice: {
      type: Number,
      default: 0
    }
  },
  setup() {
    return {
      getYenPrice
    }
  },
  methods: {
    getText() {
      return `¥${getYenPrice(this.price)}${
        this.price < this.maxPrice ? '起' : ''
      }`
    }
  }
})
</script>
<style lang="scss" scoped>
.product-price {
  display: flex;
  align-items: baseline;
  height: 44px;
  .type {
    font-size: 24px;
    color: #ff397e;
  }
  .price {
    font-size: 36px;
    color: #ff397e;
    margin-right: 4px;
  }
  .qi {
    font-size: 24px;
    color: #999999;
  }
}
</style>
