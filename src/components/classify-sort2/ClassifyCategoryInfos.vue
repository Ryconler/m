<template>
  <div class="category-infos">
    <div
      v-for="(item, index) in categoryInfos"
      :key="index"
      class="category-info"
    >
      <div class="title pf-simbold">{{ item.title }}</div>
      <div class="categorys">
        <div
          v-for="(item2, index2) in item.list"
          :key="index2"
          class="category"
          :class="item2.selected && ['active', 'pf-medium']"
          @click="selectClick(item2)"
        >
          {{ item2.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CategorysType, CategoryType } from 'types/classifySort';
import { PropType } from 'vue'

defineProps({
  categoryInfos: {
    type: Array as PropType<CategorysType[]>,
    default() {
      return []
    }
  }
})
const emit = defineEmits(['select'])

const selectClick = (category: CategoryType) => {
  emit('select', category)
}
</script>

<style lang="scss" scoped>
.category-infos {
  padding: 0 32px 48px;
  .category-info {
    .title {
      padding-top: 48px;
      font-size: 24px;
      line-height: 30px;
      color: #121212;
    }
    .categorys {
      display: flex;
      flex-wrap: wrap;
      .category {
        width: 160px;
        height: 52px;
        line-height: 52px;
        box-sizing: border-box;
        text-align: center;
        color: #262626;
        background: #ffffff;
        font-size: 24px;
        border-radius: 8px;
        margin-top: 20px;
        margin-right: 15px;
        @include ellicpsis;
        &:nth-child(4n) {
          margin-right: 0;
        }
        &.active {
          color: #ff397e;
        }
      }
    }
  }
}
</style>
