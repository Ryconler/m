<template>
  <div class="video-player">
    <VanPopup v-model:show="vanPopupShow">
      <video :src="`${videoUrl}\#t=0.1`" controls preload="metadata"></video>
    </VanPopup>
  </div>
</template>
<script lang="ts" setup>
import { Popup as VanPopup } from 'vant'
import { ref, toRefs, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  videoUrl: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:show'])

const { show } = toRefs(props)

const vanPopupShow = ref(show.value)

watch(show, val => {
  vanPopupShow.value = val
})

watch(vanPopupShow, val => {
  emits('update:show', val)
})
</script>
<style lang="scss" scoped>
.video-player {
  :deep(.van-popup) {
    background: transparent;
    video {
      display: block;
      width: 750px;
      height: 500px;
    }
  }
}
</style>
