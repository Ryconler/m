<template>
  <VanTabs
    v-model:active="selectedTab"
    class="tabs"
    style="--fix-bg: #ffffff"
    :ellipsis="false"
    sticky
    shrink
    @click-tab="tabClick"
  >
    <VanTab title="孕产" :name="ShareTaskBusinessType.Yunchan">
      <EmptyError
        v-show="!loading && taskList[ShareTaskBusinessType.Yunchan].length == 0"
        type="empty"
        text="今日暂无分享活动~"
        :image="iconFail"
      >
      </EmptyError>
      <ShareServiceTaskItem
        v-for="(item, index) in taskList[ShareTaskBusinessType.Yunchan]"
        :key="index"
        class="task-item"
        :task="item"
        :city-id="cityId"
      ></ShareServiceTaskItem>
    </VanTab>
    <VanTab title="成长加" :name="ShareTaskBusinessType.Chengzhangjia">
      <EmptyError
        v-show="
          !loading && taskList[ShareTaskBusinessType.Chengzhangjia].length == 0
        "
        type="empty"
        text="今日暂无分享活动~"
        :image="iconFail"
      >
      </EmptyError>
      <ShareServiceTaskItem
        v-for="(item, index) in taskList[ShareTaskBusinessType.Chengzhangjia]"
        :key="index"
        class="task-item"
        :task="item"
        :city-id="cityId"
      ></ShareServiceTaskItem
    ></VanTab>
    <VanTab title="自营服务" :name="ShareTaskBusinessType.Ziying">
      <EmptyError
        v-show="!loading && taskList[ShareTaskBusinessType.Ziying].length == 0"
        type="empty"
        text="今日暂无分享活动~"
        :image="iconFail"
      >
      </EmptyError>
      <ShareServiceTaskItem
        v-for="(item, index) in taskList[ShareTaskBusinessType.Ziying]"
        :key="index"
        class="task-item"
        :task="item"
        :city-id="cityId"
      ></ShareServiceTaskItem>
    </VanTab>
    <VanTab title="互动活动" :name="ShareTaskBusinessType.Huodong">
      <EmptyError
        v-show="!loading && taskList[ShareTaskBusinessType.Huodong].length == 0"
        type="empty"
        text="今日暂无分享活动~"
        :image="iconFail"
      >
      </EmptyError>
      <ShareServiceTaskItem
        v-for="(item, index) in taskList[ShareTaskBusinessType.Huodong]"
        :key="index"
        class="task-item"
        :task="item"
        :city-id="cityId"
      ></ShareServiceTaskItem
    ></VanTab>
    <VanTab title="保险" :name="ShareTaskBusinessType.Baoxian">
      <EmptyError
        v-show="!loading && taskList[ShareTaskBusinessType.Baoxian].length == 0"
        type="empty"
        text="今日暂无分享活动~"
        :image="iconFail"
      >
      </EmptyError>
      <ShareServiceTaskItem
        v-for="(item, index) in taskList[ShareTaskBusinessType.Baoxian]"
        :key="index"
        class="task-item"
        :task="item"
        :city-id="cityId"
      ></ShareServiceTaskItem>
    </VanTab>
  </VanTabs>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted, computed } from 'vue'
import { setLoading } from '@/utils'
import ShareServiceTaskItem from '../ShareServiceTaskItem.vue'
import iconFail from '@/assets/images/empty-error/icon-fail.png'
import { ShareTaskBusinessType, ShareTaskType } from '@/constant/shareService'
import { queryShareTask } from '@/api/shareService'
import { useLocation } from '@/composables/common'
import { useRoute } from 'vue-router'

setLoading(true)

const route = useRoute()

const initTab = ShareTaskBusinessType.Yunchan
const selectedTab = ref(initTab)

const { cityInfo } = useLocation({ districts: false, position: false })

const cityId = computed(() => {
  return <string>route.query.cityId || cityInfo.value.cityId
})

const loading = ref(true)
const taskList: Ref<{
  [key: number]: ShareTaskType[]
}> = ref([])

onMounted(async () => {
  taskList.value[initTab] =
    (await queryShareTask(cityId.value)).shareTaskList || []
  loading.value = false
  setLoading(false)
})

const tabClick = async (tab: { name: ShareTaskBusinessType }) => {
  loading.value = true
  taskList.value[tab.name] =
    (await queryShareTask(cityId.value)).shareTaskList || []
  loading.value = false
}
</script>

<style lang="scss" scoped>
.van-tabs {
  @include vanTab(
    $height: 84px,
    $padding: 0 32px,
    $background: #ffffff,
    $activeColor: #ff397e,
    $activeSize: 30px,
    $inactiveColor: #15161f,
    $inactiveSize: 30px,
    $tabMargin: 0 40px 0 0
  );
  :deep(.van-tabs__line) {
    display: none;
  }
  :deep(.van-tab__text) {
    font-weight: 500 !important;
  }
  .van-tab__panel {
    padding: 28px 32px;
    .task-item {
      margin-bottom: 24px;
    }
  }
}
</style>
<style lang="scss">
html,
body {
  background: #f4f5fa;
}
</style>
