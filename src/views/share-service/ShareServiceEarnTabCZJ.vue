<template>
  <VanTab title="成长加" name="chengzhangjia">
    <ClassifySort2
      ref="classifySort"
      immediate
      :options="filterOptions"
      :initial-filter="filterInitData"
      :category-infos="categoryInfo"
      :sticky-distance="classifySortStickyDistance"
      :offset-top="classifySortOffsetTop"
      @filter-change="filterChange"
    ></ClassifySort2>
    <EmptyError
      v-if="!spuList.loading && [...recommendSpus, ...spuList.list].length == 0"
      :type="spuList.error ? 'error' : 'empty'"
      :text="
        spuList.error
          ? '加载出错，请稍后再试'
          : filterIsClassify
          ? '没有找到筛选内容呢～'
          : '没有找到内容呢～'
      "
    >
      <div
        v-if="!spuList.error && filterIsClassify"
        class="reset-classify"
        @click="filterReset"
      >
        重置筛选项
      </div>
    </EmptyError>
    <div class="spu-list">
      <ShareServiceEarnSpu
        v-for="(item, index) in recommendSpus"
        :key="index"
        class="spu-item"
        :spu="item"
        :real-spu-id="item.spuId"
        :min-share-amount="item.minSaleRate"
        :max-share-amount="item.maxSaleRate"
        recommended
      ></ShareServiceEarnSpu>
    </div>
    <VanList
      v-model:loading="spuList.loading"
      v-model:error="spuList.error"
      class="spu-list"
      :finished="spuList.finished"
      :finished-text="
        [...recommendSpus, ...spuList.list].length > 0 ? '没有更多了' : ''
      "
      :immediate-check="false"
      @load="spuList.load"
    >
      <ShareServiceEarnSpu
        v-for="(item, index) in spuList.list"
        :key="index"
        class="spu-item"
        :spu="item"
        :real-spu-id="
          item.templateType2Id == 601 ? item.businessId : item.spuId
        "
        :min-share-amount="getShareAmount(item).minAmount"
        :max-share-amount="getShareAmount(item).maxAmount"
      ></ShareServiceEarnSpu>
    </VanList>
  </VanTab>
</template>
<script lang="ts" setup>
import { Tab as VanTab, List as VanList } from 'vant'
import { getShareAmount, rem2RealPx } from '@/utils'
import {
  ComponentPublicInstance,
  computed,
  nextTick,
  PropType,
  reactive,
  Ref,
  ref,
  toRefs
} from 'vue'

import ShareServiceEarnSpu from './ShareServiceEarnSpu.vue'
import { PositionType } from '@/types/position'
import { CityType } from '@/types/city'
import { DefaultCity } from '@/constant/city'
import { queryShareSpus } from '@/api/shareService'
import { FilterTypes } from '@/constant/classifySort'
import { FilterDataType } from '@/types/classifySort'

const props = defineProps({
  position: {
    type: Object as PropType<PositionType | null>,
    default() {
      return null
    }
  },
  cityInfo: {
    type: Object as PropType<CityType>,
    default() {
      return DefaultCity
    }
  },
  allRecommendSpus: {
    type: Array as PropType<any[]>,
    default() {
      return []
    }
  }
})

const { position, cityInfo, allRecommendSpus } = toRefs(props)

const { classifySortOffsetTop, classifySortStickyDistance } = (() => {
  const classifySortOffsetTop = computed(() => {
    const tabHeight = rem2RealPx(116 / 75)
    const titleBarDom = document.getElementById('title-bar')
    const titleBarHeight = titleBarDom
      ? titleBarDom.getBoundingClientRect().height
      : 0
    return titleBarHeight + tabHeight
  })

  const classifySortStickyDistance = computed(() => {
    const taskDom = document.querySelector('.share-service-task-comp')
    const bannerDom = document.querySelector('.share-service-banner')
    const taskHeight = taskDom ? taskDom.getBoundingClientRect().height : 0
    const bannerHeight = bannerDom
      ? bannerDom.getBoundingClientRect().height
      : 0
    return taskHeight + bannerHeight
  })
  return { classifySortOffsetTop, classifySortStickyDistance }
})()

const classifySort = ref()
const {
  spuList,
  categoryInfo,
  filterOptions,
  filterInitData,
  filterIsClassify,
  recommendSpus,
  filterChange,
  filterReset
} = ((
  position: Ref<PositionType | null>,
  cityInfo: Ref<CityType>,
  classifySort: Ref<any>,
  allRecommendSpus: Ref<any[]>
) => {
  const czjLevel3CategoryId: Ref<number[]> = ref([])
  const spuList = reactive({
    list: <any[]>[],
    loading: false,
    error: false,
    finished: false,
    start: 0,
    load: async () => {
      let longLatitude = undefined
      if (position.value) {
        longLatitude = `${position.value.lat},${position.value.lng}`
      }
      const openOption = !filterIsClassify.value
      try {
        const data = await queryShareSpus({
          ...filterData.value,
          level3CategoryId: czjLevel3CategoryId.value,
          shareReq: 1,
          cityId: cityInfo.value.cityId,
          start: spuList.start,
          tabs: '3',
          type: 3,
          openOption,
          longLatitude
        })
        if (openOption) {
          categoryInfo.value = data.categoryInfo
        }
        if (data.cmmdtyInfo) {
          const newSpus = data.cmmdtyInfo.list || []
          spuList.list.push(...newSpus)
          spuList.start += newSpus.length
          if (spuList.list.length == data.cmmdtyInfo.total) {
            spuList.finished = true
          }
        }
        await nextTick()
        spuList.loading = false
      } catch (error) {
        spuList.loading = false
        spuList.error = true
      }
    }
  })
  const categoryInfo = ref([])
  const filterOptions = computed(() => {
    const options = [
      FilterTypes.Category,
      FilterTypes.Earn,
      FilterTypes.Sale,
      FilterTypes.Earnonly
    ]
    return options
  })
  const filterInitData: Ref<any> = ref({
    shareGoodsOnly: 1,
    shareAmountSort: true
  })
  const filterData = ref(filterInitData.value)
  const filterIsClassify = computed(() => {
    if (
      classifySort.value &&
      !classifySort.value.allCategoryInfos[0].list[0].selected
    ) {
      return true
    }
    return false
  })
  const recommendSpus = computed(() => {
    return allRecommendSpus.value
  })
  const filterChange = (newFilterData: FilterDataType) => {
    filterData.value = newFilterData
    spuList.list = []
    spuList.loading = true
    spuList.error = false
    spuList.finished = false
    spuList.start = 0
    spuList.load()
  }
  const filterReset = () => {
    classifySort.value && classifySort.value.reset()
  }

  return {
    spuList,
    categoryInfo,
    filterOptions,
    filterInitData,
    filterIsClassify,
    recommendSpus,
    filterChange,
    filterReset
  }
})(position, cityInfo, classifySort, allRecommendSpus)
</script>
<style lang="scss" scoped>
.spu-list {
  padding: 0 32px;
  .spu-item {
    margin-bottom: 24px;
  }
}
.reset-classify {
  padding: 0 44px;
  line-height: 60px;
  font-size: 28px;
  color: #121212;
  border: 1px solid #979797;
  border-radius: 60px;
}
</style>
