<template>
  <div class="districts">
    <div
      v-for="(item, index) in districts"
      :key="index"
      class="district"
      :class="item.selected && ['active', 'pf-medium']"
      @click="selectClick(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DistrictType } from '@/types/classifySort'
import { PropType } from 'vue'

defineProps({
  districts: {
    type: Array as PropType<DistrictType[]>,
    default() {
      return []
    }
  }
})
const emit = defineEmits(['select'])

const selectClick = (district: DistrictType) => {
  emit('select', district)
}
</script>

<style lang="scss" scoped>
.districts {
  padding: 0 32px 48px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .district {
    width: 50%;
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
