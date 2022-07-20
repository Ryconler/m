<template>
  <VanTabs
    v-model:active="selectedTab"
    class="share-tabs sticky-fix"
    style="--fix-bg: #ffffff"
    :ellipsis="false"
    sticky
    :offset-top="tabOffsetTop"
    @click-tab="tabClick"
  >
    <VanTab title="商户" name="1">
      <ClassifySort
        ref="busiClassifySort"
        immediate
        :options="busiFilterOptions"
        :initial-filter="busiFilterInitData"
        :category-infos="busiCategoryInfo"
        :sticky-distance="classifySortStickyDistance"
        :offset-top="classifySortOffsetTop"
        @filter-change="busiFilterChange"
      ></ClassifySort>
      <EmptyError
        v-if="!busiList.loading && busiList.list.length == 0"
        :type="busiList.error ? 'error' : 'empty'"
        :text="
          busiList.error
            ? '加载出错，请稍后再试'
            : busiFilterIsClassify
            ? '没有找到筛选内容呢～'
            : '没有找到内容呢～'
        "
      >
        <div
          v-if="!busiList.error && busiFilterIsClassify"
          class="reset-classify"
          @click="busiFilterReset"
        >
          重置筛选项
        </div>
      </EmptyError>
      <VanList
        v-else
        v-model:loading="busiList.loading"
        v-model:error="busiList.error"
        class="busi-list"
        :finished="busiList.finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="busiList.load"
      >
        <div
          v-for="(item1, index1) in busiList.list"
          :key="index1"
          class="busi-item"
        >
          <a class="busi-title" :href="getBusiLink(item1)">
            <BaseImg
              class="busi-head"
              :src="item1.storeHeadImg"
              width="56"
              height="56"
            />
            <span class="pf-medium">{{ item1.storeName }}</span>
            <i v-if="item1.distance" class="busi-distance"
              >{{ getBusiDistance(item1.distance) }}km</i
            >
          </a>
          <ShareSpuItem
            v-for="(item2, index2) in item1.allSpuInfo || item1.spuInfo"
            :key="index2"
            class="busi-spu"
            :spu="item2"
            :real-spu-id="
              item2.templateType2Id == 601 ? item2.businessId : item2.spuId
            "
            :min-share-amount="getShareAmount(item2).minAmount"
            :max-share-amount="getShareAmount(item2).maxAmount"
            @add-success="$toast('添加成功')"
            @add-exist="$toast('商品已存在清单中')"
            @add-fail="$toast('添加失败')"
          ></ShareSpuItem>
          <span
            v-if="item1.spuNum > 2 && !item1.allSpuInfo"
            class="busi-more"
            @click="moreBusiSpus(item1)"
          >
            查看更多<i></i>
          </span>
        </div>
      </VanList>
    </VanTab>
    <VanTab title="商品" name="2">
      <ClassifySort
        ref="spuClassifySort"
        immediate
        :options="spuFilterOptions"
        :initial-filter="spuFilterInitData"
        :category-infos="spuCategoryInfo"
        :sticky-distance="classifySortStickyDistance"
        :offset-top="classifySortOffsetTop"
        @filter-change="spuFilterChange"
      ></ClassifySort>
      <EmptyError
        v-if="!spuList.loading && spuList.list.length == 0"
        :type="spuList.error ? 'error' : 'empty'"
        :text="
          spuList.error
            ? '加载出错，请稍后再试'
            : spuFilterIsClassify
            ? '没有找到筛选内容呢～'
            : '没有找到内容呢～'
        "
      >
        <div
          v-if="!spuList.error && spuFilterIsClassify"
          class="reset-classify"
          @click="spuFilterReset"
        >
          重置筛选项
        </div>
      </EmptyError>
      <VanList
        v-else
        v-model:loading="spuList.loading"
        v-model:error="spuList.error"
        class="spu-list"
        :finished="spuList.finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="spuList.load"
      >
        <ShareSpuItem
          v-for="(item, index) in spuList.list"
          :key="index"
          class="spu-item"
          :spu="item"
          :real-spu-id="
            item.templateType2Id == 601 ? item.businessId : item.spuId
          "
          :min-share-amount="getShareAmount(item).minAmount"
          :max-share-amount="getShareAmount(item).maxAmount"
          store-show
          @add-success="$toast('添加成功')"
          @add-exist="$toast('商品已存在清单中')"
          @add-fail="$toast('添加失败')"
        ></ShareSpuItem>
      </VanList>
    </VanTab>
  </VanTabs>
</template>
<script lang="ts" setup>
import { Tabs as VanTabs, Tab as VanTab, List as VanList } from 'vant'
import {
  ComponentPublicInstance,
  computed,
  getCurrentInstance,
  PropType,
  reactive,
  Ref,
  ref,
  toRefs
} from 'vue'
import ShareSpuItem from './ShareSpuItem.vue'
import { PositionType } from '@/types/position'
import { CityType } from '@/types/city'
import { DefaultCity } from '@/constant/city'
import { rem2RealPx, getShareAmount } from '@/utils'
import { queryAllSpus, queryShareList } from '@/api/shareEarn'
import { FilterTypes } from '@/constant/classifySort'

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
  }
})
const internalInstance = getCurrentInstance()

const { position, cityInfo } = toRefs(props)

const selectedTab = ref('')

const { tabOffsetTop, classifySortOffsetTop, classifySortStickyDistance } =
  (() => {
    const tabOffsetTop = computed(() => rem2RealPx(88 / 75))
    const classifySortOffsetTop = computed(() => {
      const titleBarHeight = rem2RealPx(88 / 75)
      const tabHeight = rem2RealPx(113 / 75)
      return titleBarHeight + tabHeight
    })
    const classifySortStickyDistance = computed(() => window.mainHeight)
    return { tabOffsetTop, classifySortOffsetTop, classifySortStickyDistance }
  })()

const busiClassifySort: Ref<ComponentPublicInstance | null> = ref(null)
const {
  busiList,
  busiCategoryInfo,
  busiFilterOptions,
  busiFilterInitData,
  busiFilterIsClassify,
  busiFilterChange,
  busiFilterReset,
  getBusiLink,
  getBusiDistance,
  moreBusiSpus
} = ((
  position: Ref<PositionType | null>,
  cityInfo: Ref<CityType>,
  classifySort: Ref<any>
) => {
  const busiList = reactive({
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
      const openOption = !busiFilterIsClassify.value
      try {
        const data = await queryShareList({
          ...filterData.value,
          shareReq: 1,
          cityId: cityInfo.value.cityId,
          start: busiList.start,
          tabs: '2',
          type: 2,
          openOption,
          longLatitude
        })
        busiList.loading = false
        if (openOption) {
          busiCategoryInfo.value = data.categoryInfo
        }
        if (data.businessInfo) {
          const newBusis = data.businessInfo.list || []
          busiList.list.push(...newBusis)
          busiList.start += newBusis.length
          if (busiList.list.length == data.businessInfo.total) {
            busiList.finished = true
          }
        }
      } catch (error) {
        busiList.loading = false
        busiList.error = true
      }
    }
  })
  const busiCategoryInfo = ref([])
  const busiFilterOptions = computed(() => {
    const options = [
      FilterTypes.Category,
      FilterTypes.Good,
      FilterTypes.Earnonly
    ]
    if (position.value) {
      options.push(FilterTypes.Distance)
    }
    return options
  })
  const busiFilterInitData: Ref<any> = ref({
    shareGoodsOnly: 1,
    distanceSort: true
  })
  const filterData = ref(busiFilterInitData.value)
  const busiFilterIsClassify = computed(() => {
    if (
      classifySort.value &&
      !classifySort.value.allCategoryInfos[0].list[0].selected
    ) {
      return true
    }
    return false
  })
  const busiFilterChange = (newFilterData: any) => {
    filterData.value = newFilterData
    busiList.list = []
    busiList.loading = true
    busiList.error = false
    busiList.finished = false
    busiList.start = 0
    busiList.load()
  }
  const busiFilterReset = () => {
    classifySort.value && classifySort.value.reset()
  }
  const getBusiLink = (busi: any) => {
    const { isSpot, businessType, businessId } = busi
    return ``
  }
  const getBusiDistance = (distance: string) => {
    return +distance > 60 ? '>60' : distance
  }
  const moreBusiSpus = async (busi: any) => {
    const param: any = {
      cityId: cityInfo.value.cityId,
      isSpec: 2, // 0:不返回定制商品、2:返回所有商品
      limit: 100,
      ...filterData.value
    }
    param.storeId = [busi.storeId]
    const result = await queryAllSpus(param)
    let allSpuInfo: any[] = result.list || []
    const spuInfo = busi.spuInfo
    allSpuInfo = allSpuInfo.filter((item: any) => {
      return !spuInfo.some((item2: any) => item2.spuId == item.spuId)
    })
    allSpuInfo = spuInfo.concat(allSpuInfo)
    busi.allSpuInfo = allSpuInfo
  }
  return {
    busiList,
    busiCategoryInfo,
    busiFilterOptions,
    busiFilterInitData,
    busiFilterIsClassify,
    busiFilterChange,
    busiFilterReset,
    getBusiLink,
    getBusiDistance,
    moreBusiSpus
  }
})(position, cityInfo, busiClassifySort)

const spuClassifySort: Ref<ComponentPublicInstance | null> = ref(null)
const {
  spuList,
  spuCategoryInfo,
  spuFilterOptions,
  spuFilterInitData,
  spuFilterIsClassify,
  spuFilterChange,
  spuFilterReset
} = ((
  position: Ref<PositionType | null>,
  cityInfo: Ref<CityType>,
  classifySort: Ref<any>
) => {
  const spuList = reactive({
    list: <any[]>[],
    loading: false,
    error: false,
    finished: false,
    start: 0,
    categoryInfo: [],
    load: async () => {
      let longLatitude = undefined
      if (position.value) {
        longLatitude = `${position.value.lat},${position.value.lng}`
      }
      const openOption = !spuFilterIsClassify.value
      try {
        const data = await queryShareList({
          ...filterData.value,
          shareReq: 1,
          cityId: cityInfo.value.cityId,
          start: spuList.start,
          tabs: '3',
          type: 3,
          openOption,
          longLatitude
        })
        spuList.loading = false
        if (openOption) {
          spuCategoryInfo.value = data.categoryInfo
        }
        if (data.cmmdtyInfo) {
          const newSpus = data.cmmdtyInfo.list || []
          spuList.list.push(...newSpus)
          spuList.start += newSpus.length
          if (spuList.list.length == data.cmmdtyInfo.total) {
            spuList.finished = true
          }
        }
      } catch (error) {
        spuList.loading = false
        spuList.error = true
      }
    }
  })
  const spuCategoryInfo = ref([])
  const spuFilterOptions = computed(() => {
    const options = [
      FilterTypes.Category,
      FilterTypes.Earn,
      FilterTypes.Sale,
      FilterTypes.Earnonly
    ]
    return options
  })
  const spuFilterInitData: Ref<any> = ref({
    shareGoodsOnly: 1,
    shareAmountSort: true
  })
  const filterData = ref(spuFilterInitData.value)
  const spuFilterIsClassify = computed(() => {
    if (
      classifySort.value &&
      !classifySort.value.allCategoryInfos[0].list[0].selected
    ) {
      return true
    }
    return false
  })
  const spuFilterChange = (newFilterData: any) => {
    filterData.value = newFilterData
    spuList.list = []
    spuList.loading = true
    spuList.error = false
    spuList.finished = false
    spuList.start = 0
    spuList.load()
  }
  const spuFilterReset = () => {
    classifySort.value && classifySort.value.reset()
  }
  return {
    spuList,
    spuCategoryInfo,
    spuFilterOptions,
    spuFilterInitData,
    spuFilterIsClassify,
    spuFilterChange,
    spuFilterReset
  }
})(position, cityInfo, spuClassifySort)

const tabClick = (tab: any) => {
  const { name } = tab
  internalInstance &&
    internalInstance.appContext.config.globalProperties.$trackClick({
      bizType: '127',
      pageLevelId: '121013316',
      clickId: '200002',
      positionId: name
    })
}
</script>
<style lang="scss" scoped>
/* 商户商品标签项 */
.share-tabs {
  @include vanTab;
}
/* 每个标签内容 */
.share-tabs {
  .busi-list {
    padding: 0 24px;
    .busi-item {
      background: #ffffff;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      .busi-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        .busi-head {
          flex: none;
          border-radius: 4px;
          overflow: hidden;
          margin-right: 20px;
        }
        span {
          flex: 1;
          font-size: 34px;
          color: #121212;
          line-height: 42px;
          @include ellicpsis;
        }
        .busi-distance {
          flex: none;
          font-size: 26px;
          color: #999999;
          line-height: 28px;
        }
      }
      .busi-spu {
        margin-bottom: 16px;
        background: #f8f8f8;
        &:last-of-type {
          margin-bottom: 0;
        }
      }
      .busi-more {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        color: #666666;
        line-height: 32px;
        padding-top: 20px;
        i {
          display: inline-block;
          width: 22px;
          height: 22px;
          background: url('@/assets/images/share-earn/icon-arrow-down.png') 0 0/100%
            100% no-repeat;
          margin-left: 8px;
        }
      }
    }
  }
  .spu-list {
    padding: 0 24px;
    .spu-item {
      margin-bottom: 20px;
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
}
</style>
