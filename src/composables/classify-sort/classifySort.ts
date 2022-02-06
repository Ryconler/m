import { Sticky as VanSticky } from 'vant'
import {
  CategoryAll,
  CategorysType,
  CategoryType,
  DistrictAll,
  DistrictType,
  FilterTypes,
  FilterDataType
} from '@/constant/classifySort'
import {
  computed,
  getCurrentInstance,
  markRaw,
  ref,
  Ref,
  toRefs,
  watch
} from 'vue'

export const getFilterComponent = (props: any, emit: any) => {
  const { immediate, initialFilter, sticky, options } = toRefs(props)

  const componentName: Ref<any> = ref('div')
  if (sticky.value) {
    // 当使用compoentis传入组件时需要把引入的组件对象使用markRaw函数修改为不响应的原始值
    componentName.value = markRaw(VanSticky)
  }
  const initFilterData: any = {}
  if (options.value.indexOf(FilterTypes.DISTANCE) > -1) {
    initFilterData.distanceSort = false
  }
  if (options.value.indexOf(FilterTypes.GOOD) > -1) {
    initFilterData.storeFavPersonNumSort = false
  }
  if (options.value.indexOf(FilterTypes.EARN) > -1) {
    initFilterData.shareAmountSort = false
  }
  if (options.value.indexOf(FilterTypes.SALE) > -1) {
    initFilterData.saleNumSort = false
  }
  if (options.value.indexOf(FilterTypes.EARNONLY) > -1) {
    initFilterData.shareGoodsOnly = 0
  }
  const filterData: Ref<FilterDataType> = ref({
    ...initFilterData,
    ...initialFilter.value
  })
  const shareGoodsOnlyBoolean = ref(!!filterData.value.shareGoodsOnly)
  watch(shareGoodsOnlyBoolean, (val) => {
    filterData.value.shareGoodsOnly = val ? 1 : 0
  })
  watch(
    filterData,
    () => {
      emit('filter-change', filterData.value)
    },
    {
      deep: true,
      immediate: immediate.value
    }
  )
  const resetFilterData = () => {
    filterData.value = {
      ...initFilterData,
      ...initialFilter.value
    }
    shareGoodsOnlyBoolean.value = !!filterData.value.shareGoodsOnly
  }
  return {
    componentName,
    filterData,
    shareGoodsOnlyBoolean,
    resetFilterData
  }
}

export const getClassify = (props: any) => {
  const { sticky, stickyDistance } = toRefs(props)

  const internalInstance = getCurrentInstance()

  /* 获取父元素 */
  function getParentDom() {
    if (internalInstance && internalInstance.proxy) {
      const element = internalInstance && internalInstance.proxy.$el
      return element.parentElement || { style: {} }
    }
    return { style: {} }
  }

  let oldParentHeight: any
  /* 菜单打开前吸顶 */
  const classifyOpen = () => {
    if (sticky.value) {
      if (window.scrollY < Math.ceil(stickyDistance.value)) {
        oldParentHeight = getParentDom().style.minHeight
        getParentDom().style.minHeight = '100vh'
        window.scrollTo(0, Math.ceil(stickyDistance.value))
      } else {
        /* 解决VanDropdownMenu手动滚动吸顶后，menu的滚动位置不再改变导致offset不会更新，导致下拉菜单top位置不对的问题
          源码：/node_modules/vant/es/dropdown-menu/DropdownMenu.js
          var onScroll = () => {
            if (opened.value) {
              updateOffset();
            }
          };
          解决方法：手动给Menu制造一个滚动，触发updateOffset()
        */
        const scrollY = window.scrollY
        window.scrollTo(0, 0)
        window.scrollTo(0, scrollY)
      }
    }
  }
  /* 菜单关闭后恢复设置的minHeight */
  const classifyClosed = () => {
    if (sticky.value) {
      if (oldParentHeight !== undefined) {
        getParentDom().style.minHeight = oldParentHeight
        oldParentHeight = undefined
      }
    }
  }
  return {
    classifyOpen,
    classifyClosed
  }
}

export const getCategory = (
  props: any,
  filterData: Ref<FilterDataType>,
  dropdownItems: Ref<any>[]
) => {
  const { categoryInfos } = toRefs(props)
  const [categoryDropdownItem, districtDropdownItem] = dropdownItems

  const allCategoryInfos: Ref<CategorysType[]> = computed(() => {
    return [CategoryAll, ...categoryInfos.value]
  })

  const selectCategory: Ref<CategoryType | undefined> = computed(() => {
    const selectCategoryId = filterData.value.level4CategoryId
      ? filterData.value.level4CategoryId.join(',')
      : ''
    for (const categoryInfo of allCategoryInfos.value) {
      for (const category of categoryInfo.list) {
        if (category.categoryId == selectCategoryId) {
          selectCategoryTitle.value =
            category.title == '全部' ? categoryInfo.title : category.title
          return category
        }
      }
    }
    return undefined
  })
  const selectCategoryTitle = ref('全部')
  const categoryClick = () => {
    if (
      districtDropdownItem.value &&
      districtDropdownItem.value.state.showPopup
    ) {
      // 关闭其他下拉菜单
      districtDropdownItem.value && districtDropdownItem.value.toggle(false)
    } else {
      categoryDropdownItem.value && categoryDropdownItem.value.toggle()
    }
  }
  const categorySelect = (category: CategoryType) => {
    if (category.categoryId) {
      filterData.value.level4CategoryId = category.categoryId.split(',')
    } else {
      delete filterData.value.level4CategoryId
    }
    categoryDropdownItem.value && categoryDropdownItem.value.toggle(false)
  }

  return {
    allCategoryInfos,
    selectCategory,
    selectCategoryTitle,
    categoryClick,
    categorySelect
  }
}

export const getDistrict = (
  props: any,
  filterData: Ref<FilterDataType>,
  dropdownItems: Ref<any>[]
) => {
  const { districts } = toRefs(props)
  const [districtDropdownItem, categoryDropdownItem] = dropdownItems

  const allDistricts: Ref<DistrictType[]> = computed(() => {
    return [DistrictAll, ...districts.value]
  })

  const selectDistrict: Ref<DistrictType | undefined> = computed(() => {
    const selectDistrictId = filterData.value.districtId
    return allDistricts.value.find((item) => item.id === selectDistrictId)
  })

  const districtClick = () => {
    if (
      categoryDropdownItem.value &&
      categoryDropdownItem.value.state.showPopup
    ) {
      // 关闭其他下拉菜单
      categoryDropdownItem.value && categoryDropdownItem.value.toggle(false)
    } else {
      districtDropdownItem.value && districtDropdownItem.value.toggle()
    }
  }
  const districtSelect = (district: DistrictType) => {
    if (district.id) {
      filterData.value.districtId = district.id
    } else {
      delete filterData.value.districtId
    }
    districtDropdownItem.value && districtDropdownItem.value.toggle(false)
  }

  return {
    allDistricts,
    selectDistrict,
    districtClick,
    districtSelect
  }
}

export const getSort = (
  props: any,
  filterData: Ref<FilterDataType>,
  dropdownItems: Ref<any>[]
) => {
  const [categoryDropdownItem, districtDropdownItem] = dropdownItems

  /* 排序按钮点击切换 */
  const sortToggle = (sortKey: string) => {
    const newSort = !filterData.value[sortKey]
    if (filterData.value.hasOwnProperty('distanceSort')) {
      filterData.value.distanceSort = false
    }
    if (filterData.value.hasOwnProperty('shareAmountSort')) {
      filterData.value.shareAmountSort = false
    }
    if (filterData.value.hasOwnProperty('storeFavPersonNumSort')) {
      filterData.value.storeFavPersonNumSort = false
    }
    if (filterData.value.hasOwnProperty('saleNumSort')) {
      filterData.value.saleNumSort = false
    }
    filterData.value[sortKey] = newSort
    // 关闭所有下拉菜单
    categoryDropdownItem.value && categoryDropdownItem.value.toggle(false)
    districtDropdownItem.value && districtDropdownItem.value.toggle(false)
  }
  return {
    sortToggle
  }
}
