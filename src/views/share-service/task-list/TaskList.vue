<template>
  <div class="task-list">
    <EmptyError
      v-show="!loading && taskList.length == 0"
      type="empty"
      text="今日暂无分享活动~"
      :image="iconFail"
    >
    </EmptyError>
    <ShareServiceTaskItem
      v-for="(item, index) in taskList"
      :key="index"
      class="task-item"
      :task="item"
    ></ShareServiceTaskItem>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onActivated } from 'vue'
import { ensureLogin, setLoading } from '@/utils'
import ShareServiceTaskItem from '../ShareServiceTaskItem.vue'
import iconFail from '@/assets/images/empty-error/icon-fail.png'
import { useStore } from 'vuex'
import { queryShareTask } from '@/api/shareService'
import { getLocation } from '@/composables/common'

setLoading(true)

const { cityInfo } = getLocation()

const loading = ref(true)
const taskList: Ref<any[]> = ref([])

onActivated(async () => {
  taskList.value = []
  if (taskList.value.length == 0) {
    // 页面刷新
    taskList.value =
      (await queryShareTask(cityInfo.value.cityId)).shareTaskList || []
  }
  loading.value = false
  const hserecomkey = ''
  window.hserecomkey = hserecomkey
  setLoading(false)
})
</script>

<style lang="scss" scoped>
.task-list {
  padding: 28px 32px;
  .task-item {
    margin-bottom: 24px;
  }
}
</style>
<style lang="scss">
html,
body {
  background: #f4f5fa;
}
</style>
