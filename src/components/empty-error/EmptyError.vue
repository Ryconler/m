<template>
  <VanEmpty :image="showImage" :image-size="120" :description="text">
    <slot></slot>
  </VanEmpty>
</template>
<script lang="ts" setup>
import { Empty as VanEmpty } from 'vant'
import { computed, toRefs } from 'vue'
import imageEmpty from '@/assets/images/empty-error/icon-empty.png'
import imageError from '@/assets/images/empty-error/icon-error.png'

const props = defineProps({
  type: {
    type: String,
    default: 'error'
  },
  image: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
})
const { type, image } = toRefs(props)

const showImage = computed(() => {
  if (image.value) {
    return image.value
  } else if (type.value == 'error') {
    return imageError
  } else if (type.value == 'empty') {
    return imageEmpty
  } else {
    return ''
  }
})
</script>
<style scoped>
:deep(.van-empty__bottom) {
  margin-top: 48px;
}
</style>
