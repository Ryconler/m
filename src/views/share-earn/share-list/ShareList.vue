<template>
  <div class="share-list">
    <EmptyError
      v-if="!loading && list.length == 0"
      type="empty"
      text="暂未添加任何清单~"
      :image="iconFail"
    >
    </EmptyError>
    <ShareSpuItem
      v-for="(item, index) in list"
      :key="index"
      :spu="item"
      :real-spu-id="item.spuId"
      :in-list="true"
      :min-share-amount="item.minSaleRate"
      :max-share-amount="item.maxSaleRate"
      @del-success="deleteSuccess"
    ></ShareSpuItem>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onActivated } from 'vue'
import { Toast } from 'vant'
import { querySpuCheckList } from '@/api/shareEarn'
import { ensureLogin } from '@/utils'
import ShareSpuItem from '../ShareSpuItem.vue'
import iconFail from '@/assets/images/empty-error/icon-fail.png'

const list: Ref<any[]> = ref([])

onActivated(async () => {
  ensureLogin()
  getShareList()
})

const loading = ref(true)

const getShareList = async () => {
  loading.value = true
  querySpuCheckList()
    .then(data => {
      loading.value = false
      list.value = []
      list.value = data
    })
    .catch(() => {
      loading.value = false
    })
}

const deleteSuccess = () => {
  Toast('删除成功')
  getShareList()
}
</script>

<style lang="scss" scoped>
.share-list {
  width: 100%;
  padding-bottom: 24px;
  .share-spu-item {
    margin: 24px 24px 0 24px;
  }
}
</style>
