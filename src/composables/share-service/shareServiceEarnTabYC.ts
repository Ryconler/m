import { queryShareSpus } from '@/api/shareService'
import { FilterTypes } from '@/constant/classifySort'
import { ShareSpuType } from '@/constant/shareService'
import { CityType } from '@/types/city'
import { FilterDataType } from '@/types/classifySort'
import { PositionType } from '@/types/position'
import { computed, nextTick, reactive, Ref, ref } from 'vue'

/* 孕产模块分享赚商品列表 */
export const useShareSpus = (
  position: Ref<PositionType | null>,
  cityInfo: Ref<CityType>,
  classifySort: Ref<any>,
  allRecommendSpus: Ref<ShareSpuType[]>
) => {
  const spuList = reactive({
    list: <ShareSpuType[]>[],
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
          shareReq: 1,
          isShowHideSpu: 1,
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
    },
    itemInView: (isLast = false) => {}
  })
  const categoryInfo = ref([])
  const filterOptions = computed(() => {
    const options = [
      FilterTypes.Category,
      FilterTypes.District, //城区筛选
      FilterTypes.Earn,
      FilterTypes.Sale
    ]
    return options
  })
  const filterInitData: Ref<FilterDataType> = ref({
    shareGoodsOnly: 1,
    shareAmountSort: true
  })
  const filterData = ref(filterInitData.value)
  const filterIsClassify = computed(() => {
    if (
      classifySort.value &&
      (!classifySort.value.allCategoryInfos[0].list[0].selected ||
        !classifySort.value.allDistricts[0].selected)
    ) {
      return true
    }
    return false
  })
  const recommendSpus = computed(() => {
    return allRecommendSpus.value.filter(item => <number>item.maxSaleRate > 0)
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
}
