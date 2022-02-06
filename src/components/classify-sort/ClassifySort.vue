<template>
  <component :is="componentName" class="classify-sort" :offset-top="offsetTop">
    <VanDropdownMenu>
      <VanDropdownItem
        v-if="options.indexOf(FilterTypes.CATEGORY) > -1"
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
            :select-category="selectCategory"
            @select="categorySelect"
          ></ClassifyCategoryInfos>
        </template>
      </VanDropdownItem>
      <VanDropdownItem
        v-if="options.indexOf(FilterTypes.DISTRICT) > -1"
        ref="districtDropdownItem"
        disabled
        :lazy-render="false"
        @open="classifyOpen"
        @closed="classifyClosed"
      >
        <template #title>
          <div class="title" @click="districtClick">
            {{ selectDistrict && selectDistrict.name }}<i></i>
          </div>
        </template>
        <template #default>
          <ClassifyDistricts
            :districts="allDistricts"
            :select-district="selectDistrict"
            @select="districtSelect"
          ></ClassifyDistricts>
        </template>
      </VanDropdownItem>
      <VanDropdownItem
        v-if="options.indexOf(FilterTypes.DISTANCE) > -1"
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
      <VanDropdownItem v-if="options.indexOf(FilterTypes.EARN) > -1" disabled>
        <template #title>
          <div
            :class="['title', filterData.shareAmountSort && 'active']"
            @click="sortToggle('shareAmountSort')"
          >
            佣金
          </div>
        </template>
      </VanDropdownItem>
      <VanDropdownItem v-if="options.indexOf(FilterTypes.GOOD) > -1" disabled>
        <template #title>
          <div
            :class="['title', filterData.storeFavPersonNumSort && 'active']"
            @click="sortToggle('storeFavPersonNumSort')"
          >
            好评
          </div>
        </template>
      </VanDropdownItem>
      <VanDropdownItem v-if="options.indexOf(FilterTypes.SALE) > -1" disabled>
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
      v-if="options.indexOf(FilterTypes.EARNONLY) > -1"
      v-model="shareGoodsOnlyBoolean"
      class="classify-check"
      checked-color="#ff5900"
      >仅看xxx的商品</VanCheckbox
    >
  </component>
</template>

<script lang="ts" setup>
import { PropType, ref, Ref } from 'vue'
import {
  DropdownMenu as VanDropdownMenu,
  DropdownItem as VanDropdownItem,
  Checkbox as VanCheckbox
} from 'vant'
import ClassifyCategoryInfos from './ClassifyCategoryInfos.vue'
import ClassifyDistricts from './ClassifyDistricts.vue'
import {
  CategorysType,
  DistrictType,
  FilterDataType,
  FilterTypes
} from '@/constant/classifySort'
import {
  getCategory,
  getClassify,
  getDistrict,
  getFilterComponent,
  getSort
} from '@/composables/classify-sort/classifySort'

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
  districts: {
    type: Array as PropType<DistrictType[]>,
    default() {
      return []
    }
  },
  /* 是否开启吸顶 */
  sticky: {
    type: Boolean,
    default: true
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
const emit = defineEmits(['filter-change'])

const { componentName, filterData, shareGoodsOnlyBoolean, resetFilterData } =
  getFilterComponent(props, emit)

const { classifyOpen, classifyClosed } = getClassify(props)

const categoryDropdownItem: Ref<any> = ref(null)
const districtDropdownItem: Ref<any> = ref(null)
const {
  allCategoryInfos,
  selectCategory,
  selectCategoryTitle,
  categoryClick,
  categorySelect
} = getCategory(props, filterData, [categoryDropdownItem, districtDropdownItem])

const { allDistricts, selectDistrict, districtClick, districtSelect } =
  getDistrict(props, filterData, [districtDropdownItem, categoryDropdownItem])

const { sortToggle } = getSort(props, filterData, [
  categoryDropdownItem,
  districtDropdownItem
])

defineExpose({
  resetFilterData
})
</script>

<style lang="scss" scoped>
.classify-sort {
  overflow: hidden;
  .van-dropdown-menu {
    :deep(.van-dropdown-menu__bar) {
      height: auto;
      padding-left: 24px;
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
    border: 2px solid #ff5900;
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
    :deep(.van-checkbox__label) {
      font-size: 26px;
      color: #ff5900;
      line-height: 30px;
      margin-left: 8px;
    }
  }
}
</style>
