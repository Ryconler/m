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
          <div class="title" @click="categoryClick">
            {{ selectCategoryTitle }}<i></i>
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
        v-if="options.indexOf(FilterTypes.Distance) > -1"
        disabled
      >
        <template #title>
          <div
            :class="['title', filterData.distanceSort && 'active']"
            @click="sortToggle('distanceSort')"
          >
            距离
          </div>
        </template>
      </VanDropdownItem>
      <VanDropdownItem v-if="options.indexOf(FilterTypes.Earn) > -1" disabled>
        <template #title>
          <div
            :class="['title', filterData.shareAmountSort && 'active']"
            @click="sortToggle('shareAmountSort')"
          >
            佣金
          </div>
        </template>
      </VanDropdownItem>
      <VanDropdownItem v-if="options.indexOf(FilterTypes.Good) > -1" disabled>
        <template #title>
          <div
            :class="['title', filterData.storeFavPersonNumSort && 'active']"
            @click="sortToggle('storeFavPersonNumSort')"
          >
            好评
          </div>
        </template>
      </VanDropdownItem>
      <VanDropdownItem v-if="options.indexOf(FilterTypes.Sale) > -1" disabled>
        <template #title>
          <div
            :class="['title', filterData.saleNumSort && 'active']"
            @click="sortToggle('saleNumSort')"
          >
            销量
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
  </VanSticky>
</template>

<script lang="ts" setup>
import {
  ComponentPublicInstance,
  nextTick,
  PropType,
  ref,
  Ref,
  toRefs,
  watch
} from 'vue'
import {
  Sticky as VanSticky,
  DropdownMenu as VanDropdownMenu,
  DropdownItem as VanDropdownItem,
  Checkbox as VanCheckbox,
  DropdownItemInstance
} from 'vant'
import ClassifyCategoryInfos from './ClassifyCategoryInfos.vue'
import { FilterTypes } from '@/constant/classifySort'
import { CategorysType, CategoryType, FilterDataType } from 'types/classifySort'

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
  categoryInfos: {
    type: Array as PropType<CategorysType[]>,
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
  options,
  immediate,
  initialFilter,
  categoryInfos,
  stickyDistance,
  offsetTop
} = toRefs(props)

const emit = defineEmits(['filter-change'])

const classifySort: Ref<ComponentPublicInstance | null> = ref(null)

/* 设置父元素的最低高度 */
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

const categoryDropdownItem = ref()
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
  const selectCategoryTitle = ref('全部')
  // 下拉框点击
  const categoryClick = () => {
    categoryDropdownItem.value && categoryDropdownItem.value.toggle()
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
    selectCategoryTitle.value = '全部'
  }

  return {
    allCategoryInfos,
    selectCategoryTitle,
    categoryClick,
    categorySelect,
    resetCategory
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
  }
  return {
    sortToggle
  }
})()

defineExpose({
  allCategoryInfos,
  reset() {
    resetFilterData()
    resetCategory()
  }
})
</script>

<style lang="scss" scoped>
.classify-sort {
  overflow: hidden;
  .van-dropdown-menu {
    :deep(.van-dropdown-menu__bar) {
      height: auto;
      padding: 0 24px;
      overflow: hidden;
      flex-wrap: nowrap;
      box-shadow: none;
      background: #ffffff;
      .van-dropdown-menu__item {
        margin-right: 18px;
        flex: none;

        .van-dropdown-menu__title {
          padding: 0;
          &::after {
            display: none;
          }
          .title {
            width: 162px;
            height: 60px;
            line-height: 60px;
            text-align: center;
            font-size: 26px;
            color: #666666;
            background: #ffffff;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            @include ellicpsis;
            i {
              display: inline-block;
              vertical-align: middle;
              width: 10px;
              height: 8px;
              background: url('@/assets/images/classify-sort/icon-arrow-down.png')
                0 0/100% 100% no-repeat;
              margin-left: 8px;
            }
          }
          .title.active {
            color: #ff5900;
          }
        }
        .van-dropdown-menu__title.van-dropdown-menu__title--down {
          .title {
            background: #f6f6f6;
            i {
              transform: rotate(180deg);
            }
          }
        }
      }
    }
    :deep(.van-dropdown-item) {
      .van-overlay {
        top: 2px;
      }
      .van-dropdown-item__content {
        background: #f6f6f6;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      }
    }
  }
  .classify-check {
    height: 60px;
    margin: 20px 24px;
    justify-content: center;
    background: #fff3ed;
    overflow: initial;
    border: 1px solid #ff5900;
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
        border-color: #ff5900;
        background-color: #ff5900;
      }
    }
    :deep(.van-checkbox__label) {
      font-size: 26px;
      color: #ff5900;
      line-height: 30px;
      margin-left: 8px;
    }
  }
}
</style>
