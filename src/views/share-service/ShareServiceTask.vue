<template>
  <div class="share-service-task">
    <div class="title">
      <i></i>
      <div class="title-text pf-medium">今日分享活动</div>
      <div class="more" @click="moreClick"></div>
    </div>
    <div class="task-list">
      <ShareServiceTaskItem
        v-for="(item, index) in tasks.slice(0, 2)"
        :key="index"
        class="task-item"
        :task="item"
        :slices="undefined"
      ></ShareServiceTaskItem>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ShareServiceTaskItem from './ShareServiceTaskItem.vue'

const props = defineProps({
  tasks: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  }
})

const { tasks } = toRefs(props)

const store = useStore()
const router = useRouter()

const moreClick = () => {
  store.commit('shareService/setTaskList', tasks.value)
  router.push({
    name: 'shareServiceTaskList'
  })
}
</script>
<style lang="scss" scoped>
.share-service-task {
  .title {
    box-sizing: border-box;
    height: 104px;
    padding: 40px 32px 24px;
    display: flex;
    align-items: center;
    i {
      width: 8px;
      height: 28px;
      background: #ff397e;
      border-radius: 4px;
      margin-right: 16px;
      flex: none;
    }
    .title-text {
      font-size: 32px;
      color: #15161f;
      flex: 1;
    }
    .more {
      flex: none;
      width: 80px;
      height: 36px;
      background: url('@/assets/images/share-service/icon-more.png') 0 0/100%
        100% no-repeat;
    }
  }
  .task-list {
    padding: 0 32px;
    .task-item {
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
