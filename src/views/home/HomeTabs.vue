<template>
  <VanTabs
    v-model:active="selectedTab"
    class="home-tabs"
    :ellipsis="false"
    sticky
    :offset-top="tabOffsetTop"
    :style="{ minHeight: `calc(100vh - ${Math.ceil(tabOffsetTop - 1)}px)` }"
  >
    <VanTab title="商户">
      <ClassifySort
        ref="groupClassifySort"
        immediate
        :options="groupFilterOptions"
        :initial-filter="groupFilterInitData"
        :category-infos="groupCategoryInfo"
        :districts="districts"
        :sticky-distance="classifySortStickyDistance"
        :offset-top="classifySortOffsetTop"
        @filter-change="groupFilterChange"
      ></ClassifySort>
      <EmptyError
        v-show="!groupList.loading && groupList.list.length == 0"
        :type="groupList.error ? 'error' : 'empty'"
        :text="
          groupList.error
            ? '加载出错，请稍后再试'
            : groupFilterIsClassify
            ? '没有找到筛选内容呢～'
            : ''
        "
      >
        <div
          v-if="!groupList.error && groupFilterIsClassify"
          class="reset-classify"
          @click="groupFilterReset"
        >
          重置筛选项
        </div>
      </EmptyError>
      <VanList
        v-model:loading="groupList.loading"
        v-model:error="groupList.error"
        class="group-list"
        :finished="groupList.finished"
        finished-text="没有更多了～"
        :immediate-check="false"
        @load="groupList.load"
      >
        <div
          v-for="(item1, index1) in groupList.list"
          :key="index1"
          class="group-item"
        >
          <a class="group-title" :href="item1.link">
            <BaseImg
              class="group-head"
              :src="item1.headImage"
              width="56"
              height="56"
            />
            <span class="pf-medium">{{ item1.title }}</span>
            <i v-if="item1.subTitle" class="group-sub-title">{{
              item1.subTitle
            }}</i>
          </a>
          <ElementItem
            v-for="(item2, index2) in item1.allElementInfo ||
            item1.elementInfo.slice(0, 2)"
            :key="index2"
            class="group-element"
            :element="item2"
            @add-success="$toast('添加成功')"
            @add-exist="$toast('已存在清单中')"
            @add-fail="$toast('添加失败')"
          ></ElementItem>
          <span
            v-if="item1.elementNum > 2 && !item1.allElementInfo"
            class="group-more"
            @click="moreGroupElements(item1)"
          >
            查看更多<i></i>
          </span>
        </div>
      </VanList>
    </VanTab>
    <VanTab title="商品">
      <ClassifySort
        ref="elementClassifySort"
        immediate
        :options="elementFilterOptions"
        :initial-filter="elementFilterInitData"
        :category-infos="elementCategoryInfo"
        :districts="districts"
        :sticky-distance="classifySortStickyDistance"
        :offset-top="classifySortOffsetTop"
        @filter-change="elementFilterChange"
      ></ClassifySort>
      <EmptyError
        v-show="!elementList.loading && elementList.list.length == 0"
        :type="elementList.error ? 'error' : 'empty'"
        :text="
          elementList.error
            ? '加载出错，请稍后再试'
            : elementFilterIsClassify
            ? '没有找到筛选内容呢～'
            : ''
        "
      >
        <div
          v-if="!elementList.error && elementFilterIsClassify"
          class="reset-classify"
          @click="elementFilterReset"
        >
          重置筛选项
        </div>
      </EmptyError>
      <VanList
        v-model:loading="elementList.loading"
        v-model:error="elementList.error"
        class="element-list"
        :finished="elementList.finished"
        finished-text="没有更多了～"
        :immediate-check="false"
        @load="elementList.load"
      >
        <ElementItem
          v-for="(item, index) in elementList.list"
          :key="index"
          class="element-item"
          :element="item"
          group-title-show
          @add-success="$toast('添加成功')"
          @add-exist="$toast('已存在清单中')"
          @add-fail="$toast('添加失败')"
        ></ElementItem>
      </VanList>
    </VanTab>
  </VanTabs>
</template>
<script lang="ts" setup>
import { Tabs as VanTabs, Tab as VanTab, List as VanList } from 'vant'
import { CityType, DefaultCity, LocationType } from '@/utils'
import { PropType, Ref, ref, toRefs } from 'vue'
import {
  getOffsetTop,
  getGroupList,
  getElementList
} from '@/composables/home/homeTabs'
import { DistrictType } from '@/constant/classifySort'

const props = defineProps({
  location: {
    type: Object as PropType<LocationType | null>,
    default() {
      return null
    }
  },
  cityInfo: {
    type: Object as PropType<CityType>,
    default() {
      // eslint-disable-next-line vue/valid-define-props
      return DefaultCity
    }
  },
  districts: {
    type: Array as PropType<DistrictType[]>,
    default() {
      return []
    }
  }
})
const { location, cityInfo } = toRefs(props)

const selectedTab = ref('')

const { tabOffsetTop, classifySortOffsetTop, classifySortStickyDistance } =
  getOffsetTop()

const groupClassifySort: Ref<any> = ref(null)
const {
  groupList,
  groupCategoryInfo,
  groupFilterOptions,
  groupFilterInitData,
  groupFilterIsClassify,
  groupFilterChange,
  groupFilterReset,
  moreGroupElements
} = getGroupList(location, cityInfo, groupClassifySort)

const elementClassifySort: Ref<any> = ref(null)
const {
  elementList,
  elementCategoryInfo,
  elementFilterOptions,
  elementFilterInitData,
  elementFilterIsClassify,
  elementFilterChange,
  elementFilterReset
} = getElementList(location, cityInfo, elementClassifySort)
</script>
<style lang="scss" scoped>
.home-tabs > :deep(div) {
  .van-sticky {
    .van-tabs__wrap {
      height: 113px;
      &[class*='van-hairline']::after {
        border-top: none;
      }
      .van-tabs__nav {
        background: #ffffff;
        padding: 0;
        .van-tab {
          padding: 0;
          .van-tab__text {
            font-size: 30px;
            font-weight: 400;
            line-height: 36px;
            color: #262626;
          }
        }
        .van-tab.van-tab--active {
          .van-tab__text {
            font-weight: 500;
            color: #ff5900;
          }
        }
        .van-tabs__line {
          width: 28px;
          height: 6px;
          background-image: linear-gradient(243deg, #ff5900 5%, #ff8800 100%);
          border-radius: 3px;
          bottom: 25px;
        }
      }
    }
  }
  .van-sticky--fixed {
    background: #ffffff;
  }
}
/* 每个标签内容 */
.home-tabs > :deep(.van-tabs__content) {
  .van-tab__panel {
    .group-list {
      padding: 0 24px;
      .group-item {
        background: #ffffff;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 20px;
        .group-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          .group-head {
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
          .group-sub-title {
            flex: none;
            font-size: 26px;
            color: #999999;
            line-height: 28px;
          }
        }
        .group-element {
          margin-bottom: 16px;
          background: #f8f8f8;
          &:last-of-type {
            margin-bottom: 0;
          }
        }
        .group-more {
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
            background: url('@/assets/images/home/icon-arrow-down.png') 0 0/100%
              100% no-repeat;
            margin-left: 8px;
          }
        }
      }
    }
    .element-list {
      padding: 0 24px;
      .element-item {
        margin-bottom: 20px;
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
  }
}
</style>
