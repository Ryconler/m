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
  color: #ff5900;
  display: flex;
  align-items: center;
  height: 42px;
  .type {
    font-size: 24px;
    margin-right: 4px;
  }
  .price {
    font-size: 34px;
    margin-right: 4px;
    padding-bottom: 4px;
  }
  .qi {
    font-size: 24px;
  }
}
</style>
