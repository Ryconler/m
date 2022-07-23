<template>
  <VanTab
    title="互动活动"
    name="huodong"
    :style="`min-height: calc(100vh - ${Number(classifySortOffsetTop) - 1}px)`"
  >
    <ClassifySort2
      ref="classifySort"
      immediate
      :options="filterOptions"
      :initial-filter="filterInitData"
      :stores="stores"
      :sticky-distance="classifySortStickyDistance"
      :offset-top="classifySortOffsetTop"
      @filter-change="filterChange"
    ></ClassifySort2>
    <EmptyError
      v-if="!activityList.loading && activityList.list.length == 0"
      :type="activityList.error ? 'error' : 'empty'"
      :text="activityList.error ? '加载出错，请稍后再试' : '没有找到内容呢～'"
    >
    </EmptyError>
    <VanList
      v-model:loading="activityList.loading"
      v-model:error="activityList.error"
      class="activity-list"
      :finished="activityList.finished"
      :finished-text="activityList.list.length > 0 ? '没有更多了' : ''"
      :immediate-check="true"
      @load="activityList.load"
    >
      <div
        v-for="(item, index) in activityList.list"
        :key="index"
        class="store-item"
      >
        <div
          class="store-title"
          @click="
            storeClick({
              storeCode: item[0].storeCode,
              storeName: item[0].storeName
            })
          "
        >
          <BaseImg
            class="store-head"
            :src="item[0].storePhotoUrl"
            width="52"
            height="52"
          />
          <span class="pf-medium">{{ item[0].storeName }}</span>
        </div>
        <div
          v-for="(item2, index2) in item.slice(
            0,
            activityMoreClicked[item[0].storeCode] ? undefined : 2
          )"
          :key="index2"
          class="activity-item"
          @click="activityClick(item2)"
        >
          <BaseImg
            class="activity-image"
            :src="item2.coverPhotoUrl"
            :width="186"
            :height="140"
          />
          <div class="activity-detail">
            <div class="activity-name pf-medium">
              {{ item2.activeTheme }}
            </div>
            <div class="activity-time pf-medium">
              {{ item2.activityTimeStartFormat }}
            </div>
            <div class="activity-sign">
              <strong>{{ item2.signUpCount }}</strong
              >人已报名（{{
                item2.limitCount > 0 ? `限额${item2.limitCount}` : '名额不限'
              }}）
            </div>
            <div class="activity-money">
              <div class="activity-price">
                <template v-if="Number(item2.activitySkuPrice) > 0">
                  <div class="yen">&yen;</div>
                  <span class="num pf-medium">{{
                    getYenPrice(item2.activitySkuPrice)
                  }}</span>
                </template>
                <span v-else class="num pf-medium">免费</span>
              </div>
              <div
                class="activity-share-button"
                @click="e => activityShare(e, item2)"
              >
                立即分享
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="item.length > 2 && !activityMoreClicked[item[0].storeCode]"
          class="activity-more"
          @click="activityMoreClick(item)"
        >
          查看更多<i></i>
        </div>
      </div>
    </VanList>
  </VanTab>
</template>
<script lang="ts" setup>
import { Tab as VanTab, List as VanList } from 'vant'
import { getYenPrice } from '@/utils'
import { PropType, ref, toRefs } from 'vue'
import {
  useActivityInfo,
  useActivityShare,
  useShareActivities
} from '@/composables/share-service/shareServiceEarnTabHD'
import { useOffsetTop } from '@/composables/share-service/common'
import { PositionType } from '@/types/position'
import { CityType } from '@/types/city'
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
  }
})

const { position, cityInfo } = toRefs(props)

const { classifySortOffsetTop, classifySortStickyDistance } = useOffsetTop()

const classifySort = ref()
const {
  activityList,
  stores,
  filterOptions,
  filterInitData,
  filterChange,
  activityMoreClicked,
  activityMoreClick
} = useShareActivities(position, cityInfo)

const { storeClick, activityClick } = useActivityInfo(cityInfo)
const { activityShare } = useActivityShare(cityInfo)
</script>
<style lang="scss" scoped>
.activity-list {
  padding: 0 32px;
  .store-item {
    border-radius: 16px;
    margin-bottom: 24px;
    background: #ffffff;
    & > div:last-child {
      border-bottom: none;
    }
    .store-title {
      display: flex;
      height: 96px;
      padding: 0 24px;
      align-items: center;
      /* prettier-ignore */
      border-bottom: 1Px solid #eeeeee;
      .store-head {
        flex: none;
        border-radius: 4px;
        overflow: hidden;
        margin-right: 20px;
      }
      span {
        flex: 1;
        font-size: 28px;
        color: #333333;
        line-height: 40px;
        @include ellipsis;
      }
    }

    .activity-item {
      display: flex;
      padding: 24px 0;
      margin: 0 24px;
      /* prettier-ignore */
      border-bottom: 1Px solid #eeeeee;
      .activity-image {
        flex: none;
        border-radius: 8px;
        overflow: hidden;
        margin-right: 20px;
      }

      .activity-detail {
        flex: 1;
        overflow: hidden;
        .activity-name {
          font-size: 28px;
          color: #333333;
          line-height: 40px;
          margin-bottom: 8px;
          @include ellipsisN(2);
        }
        .activity-time {
          font-size: 24px;
          color: #666666;
          line-height: 30px;
          margin-bottom: 12px;
        }

        .activity-sign {
          font-size: 24px;
          color: #999999;
          line-height: 30px;
          margin-bottom: 16px;
          strong {
            color: #ff397e;
          }
        }
        .activity-money {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .activity-price {
            display: flex;
            align-items: baseline;
            height: 44px;
            .yen {
              font-size: 24px;
              color: #ff397e;
            }
            .num {
              font-size: 36px;
              color: #ff397e;
            }
          }
          .activity-share-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 160px;
            height: 48px;
            background: #ff397e;
            border-radius: 32px;
            font-size: 26px;
            color: #ffffff;
          }
        }
      }
    }
    .activity-more {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26px;
      color: #666666;
      line-height: 32px;
      padding-bottom: 8px;
      height: 88px;
      box-sizing: border-box;
      i {
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url('@/assets/images/share-service/icon-arrow-down.png') 0 0/100%
          100% no-repeat;
        margin-left: 8px;
      }
    }
  }
}
</style>
