<template>
  <EmptyError class="tip" :type="'no-permission'" :text="tip"> </EmptyError>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tip = computed(() => {
  return route.query.tip || '暂无权限'
})
</script>
<style lang="scss" scoped>
.tip {
  position: fixed;
  top: 40%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
}
</style>
