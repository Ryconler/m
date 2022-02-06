<template>
  <div class="check-list">
    <EmptyError
      v-show="!loading && list.length == 0"
      type="empty"
      text="暂未添加任何清单~"
      :image="iconFail"
    >
    </EmptyError>
    <ElementItem
      v-for="(item, index) in list"
      :key="index"
      :element="item"
      :in-list="true"
      @del-success="deleteSuccess"
    ></ElementItem>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onActivated } from 'vue'
import { Toast } from 'vant'
import { queryCheckedElements } from '@/api/checkList'
import { ensureLogin } from '@/utils'
import { ElementItemType } from '@/constant/elementItem'
import iconFail from '@/assets/images/empty-error/icon-fail.png'

const list: Ref<ElementItemType[]> = ref([])

onActivated(async () => {
  await ensureLogin()
  getShareList()
})

const loading = ref(true)

const getShareList = async () => {
  loading.value = true
  queryCheckedElements()
    .then((data) => {
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
.check-list {
  padding: 24px;
  .element-item {
    margin-bottom: 24px;
  }
}
</style>
