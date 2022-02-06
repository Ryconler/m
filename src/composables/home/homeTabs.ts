import { queryHomeList, queryAllElements } from '@/api/home'
import { FilterDataType, FilterTypes } from '@/constant/classifySort'
import { ElementGroupType, ElementItemType } from '@/constant/elementItem'
import { CityType, LocationType } from '@/utils'
import { computed, reactive, Ref, ref } from 'vue'
import { useStore } from 'vuex'

export const getOffsetTop = () => {
  const store = useStore()

  const tabOffsetTop = computed(() => store.state.home.titleBarHeight)
  const classifySortOffsetTop = computed(() => {
    const tabsDom = document.querySelector('.home-tabs .van-tabs__wrap')
    const tabHeight = tabsDom ? tabsDom.getBoundingClientRect().height : 0
    return store.state.home.titleBarHeight + tabHeight
  })
  const classifySortStickyDistance = computed(() => store.state.home.mainHeight)
  return { tabOffsetTop, classifySortOffsetTop, classifySortStickyDistance }
}

export const getGroupList = (
  location: Ref<LocationType | null>,
  cityInfo: Ref<CityType>,
  classifySort: Ref<any>
) => {
  const { classifySortStickyDistance } = getOffsetTop()

  const groupList = reactive({
    list: <ElementGroupType[]>[],
    loading: false,
    error: false,
    finished: false,
    start: 0,
    load: async () => {
      let longLatitude = undefined
      if (location.value) {
        longLatitude = `${location.value.lat},${location.value.lng}`
      }
      const openOption = groupCategoryInfo.value.length == 0
      try {
        const data = await queryHomeList({
          ...filterData.value,
          cityId: cityInfo.value.cityId,
          start: groupList.start,
          tabs: '2',
          type: 2,
          openOption,
          longLatitude
        })
        groupList.loading = false
        if (openOption) {
          groupCategoryInfo.value = data.categoryInfo || []
        }
        if (data.groupInfo) {
          const newGroups = data.groupInfo.list || []
          groupList.list.push(...newGroups)
          groupList.start += newGroups.length
          if (groupList.list.length == data.groupInfo.total) {
            groupList.finished = true
          }
        }
      } catch (error) {
        groupList.loading = false
        groupList.error = true
      }
    }
  })
  const groupCategoryInfo = ref([])
  const groupFilterOptions = computed(() => {
    const options = [
      FilterTypes.CATEGORY,
      FilterTypes.DISTRICT,
      FilterTypes.GOOD,
      FilterTypes.EARNONLY
    ]
    if (location.value) {
      options.push(FilterTypes.DISTANCE)
    }
    return options
  })
  const groupFilterInitData: Ref<FilterDataType> = ref({
    shareGoodsOnly: 1,
    distanceSort: true
  })
  const filterData = ref(groupFilterInitData.value)
  const groupFilterIsClassify = computed(() => {
    return (
      (filterData.value.level4CategoryId &&
        filterData.value.level4CategoryId.length > 0) ||
      filterData.value.districtId
    )
  })
  const groupFilterChange = (newFilterData: FilterDataType) => {
    filterData.value = newFilterData
    groupList.list = []
    groupList.loading = true
    groupList.error = false
    groupList.finished = false
    groupList.start = 0
    if (window.scrollY > classifySortStickyDistance.value) {
      // 当前滚动条位置在下面，重新搜索后需要吸顶
      window.scrollTo(
        0,
        Math.floor(<number>classifySortStickyDistance.value + 1)
      )
    }
    groupList.load()
  }
  const groupFilterReset = () => {
    classifySort.value && classifySort.value.resetFilterData()
  }
  const moreGroupElements = async (group: ElementGroupType) => {
    const param: any = {
      cityId: cityInfo.value.cityId,
      isSpec: 2, // 0:不返回定制商品、2:返回所有商品
      limit: 100,
      id: [group.id],
      ...filterData.value
    }
    const result = await queryAllElements(param)
    let allElementInfo: ElementItemType[] = result.list || []
    const elementInfo = group.elementInfo
    allElementInfo = allElementInfo.filter((item) => {
      return !elementInfo.some((item2) => item2.id == item.id)
    })
    allElementInfo = elementInfo.concat(allElementInfo)
    group.allElementInfo = allElementInfo
  }
  return {
    groupList,
    groupCategoryInfo,
    groupFilterOptions,
    groupFilterInitData,
    groupFilterIsClassify,
    groupFilterChange,
    groupFilterReset,
    moreGroupElements
  }
}

export const getElementList = (
  location: Ref<LocationType | null>,
  cityInfo: Ref<CityType>,
  classifySort: Ref<any>
) => {
  const { classifySortStickyDistance } = getOffsetTop()

  const elementList = reactive({
    list: <ElementItemType[]>[],
    loading: false,
    error: false,
    finished: false,
    start: 0,
    categoryInfo: [],
    load: async () => {
      let longLatitude = undefined
      if (location.value) {
        longLatitude = `${location.value.lat},${location.value.lng}`
      }
      const openOption = elementCategoryInfo.value.length == 0
      try {
        const data = await queryHomeList({
          ...filterData.value,
          cityId: cityInfo.value.cityId,
          start: elementList.start,
          tabs: '3',
          type: 3,
          openOption,
          longLatitude
        })
        elementList.loading = false
        if (openOption) {
          elementCategoryInfo.value = data.categoryInfo || []
        }
        if (data.elementInfo) {
          const newElements = data.elementInfo.list || []
          elementList.list.push(...newElements)
          elementList.start += newElements.length
          if (elementList.list.length == data.elementInfo.total) {
            elementList.finished = true
          }
        }
      } catch (error) {
        elementList.loading = false
        elementList.error = true
      }
    }
  })
  const elementCategoryInfo = ref([])
  const elementFilterOptions = computed(() => {
    const options = [
      FilterTypes.CATEGORY,
      FilterTypes.EARN,
      FilterTypes.SALE,
      FilterTypes.EARNONLY
    ]
    if (location.value) {
      options.push(FilterTypes.DISTANCE)
    }
    return options
  })
  const elementFilterInitData: Ref<FilterDataType> = ref({
    shareGoodsOnly: 1,
    shareAmountSort: true
  })
  const filterData = ref(elementFilterInitData.value)
  const elementFilterIsClassify = computed(() => {
    return (
      (filterData.value.level4CategoryId &&
        filterData.value.level4CategoryId.length > 0) ||
      filterData.value.districtId
    )
  })
  const elementFilterChange = (newFilterData: FilterDataType) => {
    filterData.value = newFilterData
    elementList.list = []
    elementList.loading = true
    elementList.error = false
    elementList.finished = false
    elementList.start = 0
    if (window.scrollY > classifySortStickyDistance.value) {
      // 当前滚动条位置在下面，重新搜索后需要吸顶
      window.scrollTo(
        0,
        Math.floor(<number>classifySortStickyDistance.value + 1)
      )
    }
    elementList.load()
  }
  const elementFilterReset = () => {
    classifySort.value && classifySort.value.resetFilterData()
  }
  return {
    elementList,
    elementCategoryInfo,
    elementFilterOptions,
    elementFilterInitData,
    elementFilterIsClassify,
    elementFilterChange,
    elementFilterReset
  }
}
