<template>
  <VanSticky ref="classifySort" class="classify-sort" :offset-top="offsetTop">
    <VanDropdownMenu>
      <VanDropdownItem
        v-if="options.indexOf(FilterTypes.Category) > -1"
        ref="categoryDropdownItem"
        disabled
        :lazy-render="false"
        @open="classifyOpen"
        @closed="classifyClosed"
      >
        <template #title>
          <div
            :class="['title', filterData.level4CategoryId && 'active']"
            @click="categoryClick"
          >
            <span>{{ selectCategoryTitle }}</span>
            <i class="arrow-one"></i>
          </div>
        </template>
        <template #default>
          <ClassifyCategoryInfos
            :category-infos="allCategoryInfos"
            @select="categorySelect"
          ></ClassifyCategoryInfos>
        </template>
      </VanDropdownItem>
      <VanDropdownItem
        v-if="options.indexOf(FilterTypes.District) > -1"
        ref="districtDropdownItem"
        disabled
        :lazy-render="false"
        @open="classifyOpen"
        @closed="classifyClosed"
      >
        <template #title>
          <div
            :class="['title', filterData.districtId && 'active']"
            @click="districtClick"
          >
            <span>{{ selectDistrictTitle }}</span>
            <i class="arrow-one"></i>
          </div>
        </template>
        <template #default>
          <ClassifyDistricts
            :districts="allDistricts"
            @select="districtSelect"
          ></ClassifyDistricts>
        </template>
      </VanDropdownItem>
      <VanDropdownItem
        v-if="options.indexOf(FilterTypes.Store) > -1"
        ref="storeDropdownItem"
        disabled
        :lazy-render="false"
        @open="classifyOpen"
        @closed="classifyClosed"
      >
        <template #title>
          <div
            :class="['title', filterData.storeCode && 'active']"
            @click="storeClick"
          >
            <span>{{ selectStoreTitle }}</span>
            <i class="arrow-one"></i>
          </div>
        </template>
        <template #default>
          <ClassifyStores
            :stores="allStores"
            @select="storeSelect"
          ></ClassifyStores>
        </template>
      </VanDropdownItem>
      <VanDropdownItem
        v-if="options.indexOf(FilterTypes.Distance) > -1"
        disabled
      >
        <template #title>
          <div
            :class="['title', filterData.distanceSort && 'active']"
            @click="sortToggle('distanceSort')"
          >
            <span>距离</span><i class="arrow-two"></i>
          </div>
        </template>
      </VanDropdownItem>
      <VanDropdownItem v-if="options.indexOf(FilterTypes.Earn) > -1" disabled>
        <template #title>
          <div
            :class="['title', filterData.shareAmountSort && 'active']"
            @click="sortToggle('shareAmountSort')"
          >
            <span>佣金</span><i class="arrow-two"></i>
          </div>
        </template>
      </VanDropdownItem>
      <VanDropdownItem v-if="options.indexOf(FilterTypes.Good) > -1" disabled>
        <template #title>
          <div
            :class="['title', filterData.storeFavPersonNumSort && 'active']"
            @click="sortToggle('storeFavPersonNumSort')"
          >
            <span>好评</span><i class="arrow-two"></i>
          </div>
        </template>
      </VanDropdownItem>
      <VanDropdownItem v-if="options.indexOf(FilterTypes.Sale) > -1" disabled>
        <template #title>
          <div
            :class="['title', filterData.saleNumSort && 'active']"
            @click="sortToggle('saleNumSort')"
          >
            <span>销量</span><i class="arrow-two"></i>
          </div>
        </template>
      </VanDropdownItem>
    </VanDropdownMenu>
    <VanCheckbox
      v-if="options.indexOf(FilterTypes.Earnonly) > -1"
      v-model="shareGoodsOnlyBoolean"
      class="classify-check"
      >仅看有分享赚商品</VanCheckbox
    >
    <div v-else style="height: 0.32rem"></div>
  </VanSticky>
</template>

<script lang="ts" setup>
import {
  PropType,
  ref,
  Ref,
  watch,
  toRefs,
  nextTick,
  ComponentPublicInstance
} from 'vue'
import {
  Sticky as VanSticky,
  DropdownMenu as VanDropdownMenu,
  DropdownItem as VanDropdownItem,
  Checkbox as VanCheckbox,
  DropdownItemInstance
} from 'vant'
import ClassifyCategoryInfos from './ClassifyCategoryInfos.vue'
import ClassifyDistricts from './ClassifyDistricts.vue'
import ClassifyStores from './ClassifyStores.vue'
import { FilterTypes } from '@/constant/classifySort'
import {
  CategorysType,
  CategoryType,
  DistrictType,
  FilterDataType,
  StoreType
} from '@/types/classifySort'

const props = defineProps({
  /* 显示的选项 */
  options: {
    type: Array as PropType<string[]>,
    default() {
      // 品类筛选、城区筛选、距离排序、佣金排序、销量排序、好评排序、过滤无分享赚
      return Object.values(FilterTypes)
    }
  },
  /* 是否立刻执行过滤 */
  immediate: {
    type: Boolean,
    default: false
  },
  /* 初始筛选条件 */
  initialFilter: {
    type: Object as PropType<FilterDataType>,
    default() {
      return {}
    }
  },
  /* 可选择的品类 */
  categoryInfos: {
    type: Array as PropType<CategorysType[]>,
    default() {
      return []
    }
  },
  /* 默认全部品类时的标题 */
  categoryTitle: {
    type: String,
    default: '全部'
  },
  /* 可选择的城区 */
  districts: {
    type: Array as PropType<DistrictType[]>,
    default() {
      return []
    }
  },
  /* 可选择的门店 */
  stores: {
    type: Array as PropType<StoreType[]>,
    default() {
      return []
    }
  },
  /* 触发吸顶需要滚动的距离 */
  stickyDistance: {
    type: Number,
    default: 0
  },
  /* 吸顶后距离顶部的距离 */
  offsetTop: {
    type: [Number, String],
    default: 0
  }
})
const {
  immediate,
  initialFilter,
  categoryInfos,
  categoryTitle,
  districts,
  stores,
  options,
  stickyDistance,
  offsetTop
} = toRefs(props)

const emit = defineEmits(['filter-change'])

const classifySort: Ref<ComponentPublicInstance | null> = ref(null)

/* 设置父元素的最低高度足以支持吸顶 */
watch(
  offsetTop,
  () => {
    nextTick(() => {
      if (classifySort.value) {
        const parentElement = classifySort.value.$el.parentElement
        parentElement.style.minHeight = `calc(100vh - ${
          Number(offsetTop.value) - 1
        }px)`
      }
    })
  },
  {
    immediate: true
  }
)

const { filterData, shareGoodsOnlyBoolean, resetFilterData } = (() => {
  const initFilterData: FilterDataType = {}
  if (options.value.indexOf(FilterTypes.Distance) > -1) {
    initFilterData.distanceSort = false
  }
  if (options.value.indexOf(FilterTypes.Good) > -1) {
    initFilterData.storeFavPersonNumSort = false
  }
  if (options.value.indexOf(FilterTypes.Earn) > -1) {
    initFilterData.shareAmountSort = false
  }
  if (options.value.indexOf(FilterTypes.Sale) > -1) {
    initFilterData.saleNumSort = false
  }
  if (options.value.indexOf(FilterTypes.Earnonly) > -1) {
    initFilterData.shareGoodsOnly = 0
  }
  const filterData: Ref<FilterDataType> = ref({
    ...initFilterData,
    ...initialFilter.value
  })
  const shareGoodsOnlyBoolean = ref(!!filterData.value.shareGoodsOnly)
  watch(shareGoodsOnlyBoolean, val => {
    filterData.value.shareGoodsOnly = val ? 1 : 0
  })
  watch(
    filterData,
    () => {
      emit('filter-change', filterData.value)
      // 当前滚动条位置在下面，重新搜索后需要吸顶
      if (window.scrollY > stickyDistance.value) {
        window.scrollTo(0, Number(stickyDistance.value) + 1)
      }
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
    filterData,
    shareGoodsOnlyBoolean,
    resetFilterData
  }
})()

const { classifyOpen, classifyClosed } = (() => {
  /* 菜单打开前吸顶 */
  const classifyOpen = () => {
    if (window.scrollY < stickyDistance.value) {
      window.scrollTo(0, stickyDistance.value + 1)
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
      window.scrollTo(0, window.scrollY - 1)
      window.scrollTo(0, window.scrollY + 1)
    }
  }
  /* 菜单关闭后不恢复 */
  const classifyClosed = () => {}
  return {
    classifyOpen,
    classifyClosed
  }
})()

const categoryDropdownItem: Ref<ComponentPublicInstance<DropdownItemInstance> | null> =
  ref(null)
const districtDropdownItem: Ref<ComponentPublicInstance<DropdownItemInstance> | null> =
  ref(null)
const storeDropdownItem: Ref<ComponentPublicInstance<DropdownItemInstance> | null> =
  ref(null)
const {
  allCategoryInfos,
  selectCategoryTitle,
  categoryClick,
  categorySelect,
  resetCategory
} = (() => {
  const firstCategory = {
    title: '全部',
    list: [
      {
        title: '全部',
        categoryId: initialFilter.value.level4CategoryId
          ? initialFilter.value.level4CategoryId.join(',')
          : '',
        selected: true
      }
    ]
  }
  // 所有可选品类
  const allCategoryInfos: Ref<CategorysType[]> = ref([
    firstCategory,
    ...categoryInfos.value
  ])
  watch(categoryInfos, () => {
    allCategoryInfos.value = [firstCategory, ...categoryInfos.value]
  })
  // 下拉框上显示的标题
  const selectCategoryTitle = ref(categoryTitle.value)
  // 下拉框点击
  const categoryClick = () => {
    if (
      districtDropdownItem.value &&
      districtDropdownItem.value.state.showPopup
    ) {
      // 关闭其他下拉菜单
      districtDropdownItem.value && districtDropdownItem.value.toggle(false)
    } else if (
      storeDropdownItem.value &&
      storeDropdownItem.value.state.showPopup
    ) {
      // 关闭其他下拉菜单
      storeDropdownItem.value && storeDropdownItem.value.toggle(false)
    } else {
      categoryDropdownItem.value && categoryDropdownItem.value.toggle()
    }
  }
  // 品类项选择
  const categorySelect = (category: CategoryType) => {
    allCategoryInfos.value.forEach(_categoryInfo => {
      _categoryInfo.list.forEach(_category => {
        if (_category === category) {
          _category.selected = true
          selectCategoryTitle.value =
            _category.title == '全部' ? _categoryInfo.title : _category.title
        } else {
          _category.selected = false
        }
      })
    })
    if (category.categoryId) {
      filterData.value.level4CategoryId = category.categoryId.split(',')
    } else {
      delete filterData.value.level4CategoryId
    }
    categoryDropdownItem.value && categoryDropdownItem.value.toggle(false)
  }
  // 重置下拉框显示
  const resetCategory = () => {
    allCategoryInfos.value.forEach(_categoryInfo => {
      _categoryInfo.list.forEach(_category => {
        _category.selected = false
      })
    })
    allCategoryInfos.value[0].list[0].selected = true
    selectCategoryTitle.value = categoryTitle.value
  }

  return {
    allCategoryInfos,
    selectCategoryTitle,
    categoryClick,
    categorySelect,
    resetCategory
  }
})()

const {
  allDistricts,
  selectDistrictTitle,
  districtClick,
  districtSelect,
  resetDistrict
} = (() => {
  const firstDistrict = { name: '全城', selected: true }
  // 所有可选城区
  const allDistricts: Ref<DistrictType[]> = ref([
    firstDistrict,
    ...districts.value
  ])
  watch(districts, () => {
    allDistricts.value = [firstDistrict, ...districts.value]
  })

  // 下拉框上显示的标题
  const selectDistrictTitle = ref('全城')
  // 下拉框点击
  const districtClick = () => {
    if (
      categoryDropdownItem.value &&
      categoryDropdownItem.value.state.showPopup
    ) {
      // 关闭其他下拉菜单
      categoryDropdownItem.value && categoryDropdownItem.value.toggle(false)
    } else if (
      storeDropdownItem.value &&
      storeDropdownItem.value.state.showPopup
    ) {
      // 关闭其他下拉菜单
      storeDropdownItem.value && storeDropdownItem.value.toggle(false)
    } else {
      districtDropdownItem.value && districtDropdownItem.value.toggle()
    }
  }
  // 城区项选择
  const districtSelect = (district: DistrictType) => {
    allDistricts.value.forEach(_district => {
      if (_district === district) {
        _district.selected = true
        selectDistrictTitle.value = _district.name
      } else {
        _district.selected = false
      }
    })
    if (district.id) {
      filterData.value.districtId = district.id
    } else {
      delete filterData.value.districtId
    }
    districtDropdownItem.value && districtDropdownItem.value.toggle(false)
  }
  // 重置下拉框显示
  const resetDistrict = () => {
    allDistricts.value.forEach(_district => {
      _district.selected = false
    })
    allDistricts.value[0].selected = true
    selectDistrictTitle.value = '全城'
  }

  return {
    allDistricts,
    selectDistrictTitle,
    districtClick,
    districtSelect,
    resetDistrict
  }
})()

const { allStores, selectStoreTitle, storeClick, storeSelect, resetStore } =
  (() => {
    const firstStore = { name: '全部', selected: true }
    // 所有可选门店
    const allStores: Ref<StoreType[]> = ref([firstStore, ...stores.value])
    watch(stores, () => {
      allStores.value = [firstStore, ...stores.value]
    })

    // 下拉框上显示的标题
    const selectStoreTitle = ref('全部')
    // 下拉框点击
    const storeClick = () => {
      if (
        categoryDropdownItem.value &&
        categoryDropdownItem.value.state.showPopup
      ) {
        // 关闭其他下拉菜单
        categoryDropdownItem.value && categoryDropdownItem.value.toggle(false)
      } else if (
        districtDropdownItem.value &&
        districtDropdownItem.value.state.showPopup
      ) {
        // 关闭其他下拉菜单
        districtDropdownItem.value && districtDropdownItem.value.toggle(false)
      } else {
        storeDropdownItem.value && storeDropdownItem.value.toggle()
      }
    }
    // 门店项选择
    const storeSelect = (store: StoreType) => {
      allStores.value.forEach(_store => {
        if (_store === store) {
          _store.selected = true
          selectStoreTitle.value = _store.name
        } else {
          _store.selected = false
        }
      })
      if (store.code) {
        filterData.value.storeCode = store.code
      } else {
        delete filterData.value.storeCode
      }
      storeDropdownItem.value && storeDropdownItem.value.toggle(false)
    }
    // 重置下拉框显示
    const resetStore = () => {
      allStores.value.forEach(_store => {
        _store.selected = false
      })
      allStores.value[0].selected = true
      selectStoreTitle.value = '全部'
    }

    return {
      allStores,
      selectStoreTitle,
      storeClick,
      storeSelect,
      resetStore
    }
  })()

const { sortToggle } = (() => {
  /* 排序按钮点击切换 */
  const sortToggle = (sortKey: string) => {
    const newSort = !filterData.value[sortKey]
    if (
      Object.prototype.hasOwnProperty.call(filterData.value, 'distanceSort')
    ) {
      filterData.value.distanceSort = false
    }
    if (
      Object.prototype.hasOwnProperty.call(filterData.value, 'shareAmountSort')
    ) {
      filterData.value.shareAmountSort = false
    }
    if (
      Object.prototype.hasOwnProperty.call(
        filterData.value,
        'storeFavPersonNumSort'
      )
    ) {
      filterData.value.storeFavPersonNumSort = false
    }
    if (Object.prototype.hasOwnProperty.call(filterData.value, 'saleNumSort')) {
      filterData.value.saleNumSort = false
    }
    filterData.value[sortKey] = newSort
    // 关闭所有下拉菜单
    categoryDropdownItem.value && categoryDropdownItem.value.toggle(false)
    districtDropdownItem.value && districtDropdownItem.value.toggle(false)
    storeDropdownItem.value && storeDropdownItem.value.toggle(false)
  }
  return {
    sortToggle
  }
})()

defineExpose({
  allCategoryInfos,
  allDistricts,
  allStores,
  reset() {
    resetFilterData()
    resetCategory()
    resetDistrict()
    resetStore()
  }
})
</script>

<style lang="scss" scoped>
.classify-sort {
  overflow: hidden;
  .van-dropdown-menu {
    /* 整体按钮 */
    :deep(.van-dropdown-menu__bar) {
      height: auto;
      padding: 0 32px;
      overflow: hidden;
      flex-wrap: nowrap;
      box-shadow: none;
      background: transparent;
      /* 单项按钮 */
      .van-dropdown-menu__item {
        margin-right: 18px;
        flex: none;
        width: 23%;
        .van-dropdown-menu__title {
          padding: 0;
          flex: 1;
          &::after {
            display: none;
          }
          /* 常规状态下的标题与箭头 */
          .title {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 8px;
            box-sizing: border-box;
            // width: 158px;
            height: 52px;
            line-height: 52px;
            font-size: 26px;
            color: #666666;
            background: #ffffff;
            border-radius: 8px;
            span {
              @include ellipsis;
            }
            i {
              flex: none;
              display: inline-block;
              vertical-align: middle;
              background-image: url('@/assets/images/classify-sort/icon-arrow-sprite.png');
              background-repeat: no-repeat;
              margin-left: 8px;
              &.arrow-one {
                width: 12px;
                height: 6px;
                background-size: 12px 16px;
                background-position: 0 -10px;
              }
              &.arrow-two {
                width: 12px;
                height: 16px;
                background-size: 12px 16px;
                background-position: 0 0;
              }
            }
          }
          /* 展开时与选中后的标题高亮 */
          .title.active,
          &.van-dropdown-menu__title--down .title {
            color: #ff397e;
            i {
              background-image: url('@/assets/images/classify-sort/icon-arrow-sprite-down.png');
            }
          }
        }
        /* 展开时的标题箭头旋转 */
        .van-dropdown-menu__title.van-dropdown-menu__title--down {
          .title {
            i {
              &.arrow-one {
                transform: rotate(180deg);
              }
            }
          }
        }
      }
      &.van-dropdown-menu__bar--opened .van-dropdown-menu__item {
        .van-dropdown-menu__title {
          .title {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
      }
    }
    /* 下拉菜单列表 */
    :deep(.van-dropdown-item) {
      .van-dropdown-item__content {
        top: -2px; //菜单内容区域上移一点否则上面会露出一点黑色背景
        background: #f4f5fa;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }
    }
  }
  /* 吸顶后 */
  :deep(.van-sticky--fixed .van-dropdown-menu) {
    .van-dropdown-menu__bar {
      .van-dropdown-menu__item {
        .van-dropdown-menu__title {
          .title {
            background: #f4f5fa; //与body背景同色
          }
        }
      }
    }
  }
  /* 分享赚筛选框 */
  .classify-check {
    height: 60px;
    margin: 20px 32px 24px;
    justify-content: center;
    background: #fff3f7;
    overflow: initial;
    border: 2px solid #ff6aa0;
    border-radius: 6px;
    :deep(.van-checkbox__icon) {
      height: auto;
      i {
        width: 28px;
        height: 28px;
        line-height: 28px;
        &::before {
          width: 100%;
          height: 100%;
          font-size: 20px;
          line-height: 28px;
        }
      }
    }
    :deep(.van-checkbox__icon--checked) {
      i {
        border-color: #ff397e;
        background-color: #ff397e;
      }
    }
    :deep(.van-checkbox__label) {
      font-size: 26px;
      color: #ff397e;
      line-height: 30px;
      margin-left: 8px;
    }
  }
}
</style>
