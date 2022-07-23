<template>
  <VanTab
    title="孕产"
    name="yunchan"
    :style="`min-height: calc(100vh - ${Number(classifySortOffsetTop) - 1}px)`"
  >
    <ClassifySort
      ref="classifySort"
      immediate
      :options="filterOptions"
      :initial-filter="filterInitData"
      :category-infos="categoryInfo"
      :districts="districts"
      :sticky-distance="classifySortStickyDistance"
      :offset-top="classifySortOffsetTop"
      @filter-change="filterChange"
    ></ClassifySort>
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
        :share-city-code="
          item.templateType2Id == 601 ? cityInfo.cityId.toString() : ''
        "
        @in-view="spuList.itemInView(index == spuList.list.length - 1)"
      ></ShareServiceEarnSpu>
    </VanList>
  </VanTab>
</template>
<script lang="ts" setup>
import { Tab as VanTab, List as VanList } from 'vant'
import { getShareAmount } from '@/utils'
import { PropType, ref, toRefs } from 'vue'
import ShareServiceEarnSpu from './ShareServiceEarnSpu.vue'
import { useShareSpus } from '@/composables/share-service/shareServiceEarnTabYC'
import { ShareSpuType } from '@/constant/shareService'
import { useOffsetTop } from '@/composables/share-service/common'
import { PositionType } from '@/types/position'
import { CityType } from '@/types/city'
import { DistrictType } from '@/types/classifySort'
import { DefaultCity } from '@/constant/city'

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
  districts: {
    type: Array as PropType<DistrictType[]>,
    default() {
      return []
    }
  },
  allRecommendSpus: {
    type: Array as PropType<ShareSpuType[]>,
    default() {
      return []
    }
  }
})

const { position, cityInfo, allRecommendSpus } = toRefs(props)

const { classifySortOffsetTop, classifySortStickyDistance } = useOffsetTop()

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
} = useShareSpus(position, cityInfo, classifySort, allRecommendSpus)
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
  border: 2px solid #979797;
  border-radius: 60px;
}
</style>
