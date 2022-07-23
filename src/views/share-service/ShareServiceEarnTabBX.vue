<template>
  <VanTab
    title="保险"
    name="baoxian"
    :style="`min-height: calc(100vh - ${Number(classifySortOffsetTop) - 1}px)`"
  >
    <EmptyError
      v-if="!insuranceList.loading && insuranceList.list.length == 0"
      :type="insuranceList.error ? 'error' : 'empty'"
      :text="insuranceList.error ? '加载出错，请稍后再试' : '没有找到内容呢～'"
    >
    </EmptyError>
    <VanList
      v-model:loading="insuranceList.loading"
      v-model:error="insuranceList.error"
      class="insurance-list"
      :finished="insuranceList.finished"
      :finished-text="insuranceList.list.length > 0 ? '没有更多了' : ''"
      :immediate-check="true"
      @load="insuranceList.load"
    >
      <div
        v-for="(item, index) in insuranceList.list"
        :key="index"
        class="insurance-item"
      >
        <a class="insurance-info" :href="item.redirectUrl">
          <BaseImg
            class="insurance-image"
            :src="item.imageUrl"
            :width="190"
            :height="190"
          />
          <div class="insurance-detail">
            <div class="insurance-name pf-medium">
              {{ item.name }}
            </div>
            <div class="insurance-desc pf-medium">
              {{ item.subTitle }}
            </div>
            <span class="insurance-tag">{{ item.abbr }}</span>
            <div class="insurance-money">
              <div class="insurance-price">
                <div class="yen pf-simbold">&yen;</div>
                <span class="num pf-simbold">{{
                  getYenPrice(item.salePriceMin)
                }}</span>
                <span v-if="item.salePriceMin < item.salePriceMax" class="qi"
                  >起</span
                >
              </div>
              <div
                v-if="item.recomInfo"
                class="insurance-earn"
                @click="e => earnDetailClick(e, item)"
              >
                <span>佣金 {{ item.recomInfo }}</span>
                <i v-if="item.recomType == 2"></i>
              </div>
            </div>
          </div>
        </a>
        <div class="insurance-function">
          <div class="insurance-sign" @click="signClick(item)">签单必看</div>
          <div class="insurance-share" @click="shareClick(item)">立即分享</div>
        </div>
      </div>
    </VanList>

    <VanOverlay class="earn-detail-overlay" :show="earnDetailShow">
      <div class="earn-detail-wrap">
        <div class="earn-detail-content">
          <h1 class="earn-detail-header">业绩明细</h1>
          <div class="earn-detail-list">
            <div class="earn-detail-list-header pf-simbold">
              <em
                v-for="(item, index) in earnDetailData.titleList"
                :key="index"
                >{{ item }}</em
              >
            </div>
            <ul class="earn-detail-list-items">
              <li
                v-for="(item, index) in earnDetailData.dataList"
                :key="index"
                class="earn-detail-list-item"
              >
                <em v-for="(item2, index2) in item" :key="index2">{{
                  item2
                }}</em>
              </li>
            </ul>
          </div>
        </div>
        <div class="earn-detail-close" @click="earnDetailShow = false">
          我知道了
        </div>
      </div>
    </VanOverlay>
  </VanTab>
</template>
<script lang="ts" setup>
import { Tab as VanTab, List as VanList, Overlay as VanOverlay } from 'vant'
import {
  useEarnDetail,
  useInsuranceClick,
  useShareInsurances
} from '@/composables/share-service/shareServiceEarnTabBX'
import { useOffsetTop } from '@/composables/share-service/common'
import { getYenPrice } from '@/utils'

const { insuranceList } = useShareInsurances()

const { classifySortOffsetTop } = useOffsetTop()

const { earnDetailData, earnDetailShow, earnDetailClick } = useEarnDetail()
const { shareClick, signClick } = useInsuranceClick()
</script>
<style lang="scss" scoped>
.insurance-list {
  padding: 0 32px;
  .insurance-item {
    background: #ffffff;
    border-radius: 16px;
    padding: 24px 24px 0;
    margin-bottom: 24px;
    .insurance-info {
      display: flex;
      padding-bottom: 24px;
      .insurance-image {
        flex: none;
        border-radius: 8px;
        overflow: hidden;
        margin-right: 20px;
      }

      .insurance-detail {
        flex: 1;
        overflow: hidden;
        .insurance-name {
          font-size: 28px;
          color: #15161f;
          line-height: 40px;
          margin-bottom: 8px;
          @include ellicpsis;
        }
        .insurance-desc {
          font-size: 24px;
          color: #999999;
          line-height: 30px;
          margin-bottom: 12px;
          @include ellicpsisN(2);
        }

        .insurance-tag {
          display: inline-block;
          box-sizing: border-box;
          padding: 0 10px;
          height: 28px;
          line-height: 24px;
          border-radius: 14px;
          border: 2px solid rgba(251, 160, 50, 1);
          font-size: 20px;
          color: #fba032;
          margin-bottom: 16px;
          @include ellicpsis;
        }
        .insurance-money {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .insurance-price {
            display: flex;
            align-items: baseline;
            height: 44px;
            .yen {
              font-size: 32px;
              color: #ff397e;
            }
            .num {
              font-size: 42px;
              color: #ff397e;
              margin-right: 3px;
            }
            .qi {
              font-size: 22px;
              color: #999999;
            }
          }
          .insurance-earn {
            display: flex;
            align-items: center;
            span {
              font-size: 26px;
              color: #ff397e;
              line-height: 36px;
            }
            i {
              width: 24px;
              height: 24px;
              background: url(@/assets/images/share-service/icon-arrow-right.png)
                0 0/100% 100% no-repeat;
              margin-left: 4px;
            }
          }
        }
      }
    }
    .insurance-function {
      box-sizing: border-box;
      height: 104px;
      padding-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      border-top: 2px solid #f4f5fa;
      .insurance-share {
        width: 160px;
        font-size: 26px;
        color: #ffffff;
        text-align: center;
        height: 52px;
        line-height: 52px;
        background: #ff397e;
        border-radius: 32px;
      }
      .insurance-sign {
        box-sizing: border-box;
        width: 160px;
        font-size: 26px;
        color: #15161f;
        text-align: center;
        height: 52px;
        line-height: 48px;
        border-radius: 32px;
        /* prettier-ignore */
        border: 1Px solid #999999;
        margin-right: 17px;
      }
    }
  }
}

.earn-detail-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  .earn-detail-wrap {
    width: 560px;
    background: #ffffff;
    border-radius: 12px;
    .earn-detail-content {
      padding: 50px 40px 55px;
      .earn-detail-header {
        text-align: center;
        font-size: 36px;
        line-height: 40px;
        color: rgba(0, 0, 0, 0.85);
      }
      .earn-detail-list {
        margin: 30px 0 21px;
        /* prettier-ignore */
        border: 1Px solid #e7e7e7;
        .earn-detail-list-header {
          background: #f5f5f5;
          display: flex;
          em {
            box-sizing: border-box;
            flex: 1;
            /* prettier-ignore */
            border-right: 1Px solid #e7e7e7;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60px;
            font-size: 22px;
            &:last-child {
              border-right: none;
            }
          }
        }
        .earn-detail-list-items {
          max-height: 305px;
          overflow-y: auto;
          .earn-detail-list-item {
            /* prettier-ignore */
            border-top: 1Px solid #e7e7e7;
            display: flex;
            &:first-child {
              border-top: none;
            }
            em {
              box-sizing: border-box;
              flex: 1;
              /* prettier-ignore */
              border-right: 1Px solid #e7e7e7;
              color: #666;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 60px;
              font-size: 22px;
              &:last-child {
                border-right: none;
              }
            }
          }
        }
      }
    }
    .earn-detail-close {
      /* prettier-ignore */
      border-top: 1Px solid #e8e8e8;
      height: 88px;
      line-height: 88px;
      text-align: center;
      color: #ff397e;
      font-size: 32px;
    }
  }
}
</style>
