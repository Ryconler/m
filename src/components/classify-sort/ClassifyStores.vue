<template>
  <div class="stores">
    <div
      v-for="(item, index) in stores"
      :key="index"
      class="store"
      :class="item.selected && ['active', 'pf-medium']"
      @click="selectClick(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { StoreType } from '@/types/classifySort'
import { PropType } from 'vue'

defineProps({
  stores: {
    type: Array as PropType<StoreType[]>,
    default() {
      return []
    }
  }
})
const emit = defineEmits(['select'])

const selectClick = (store: StoreType) => {
  emit('select', store)
}
</script>

<style lang="scss" scoped>
.stores {
  padding: 0 32px 48px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .store {
    width: 100%;
    height: 32px;
    line-height: 32px;
    color: #262626;
    font-size: 24px;
    margin-top: 44px;
    @include ellipsis;
    &.active {
      color: #ff397e;
    }
  }
}
</style>
