<template>
  <div class="element-item">
    <a class="element-info" :href="element.link">
      <BaseImg
        class="element-image"
        :src="element.image"
        :width="groupTitleShow ? 230 : 186"
        :height="groupTitleShow ? 171 : 140"
      />
      <div class="element-detail">
        <div class="element-title pf-medium">{{ element.title }}</div>
        <div v-if="groupTitleShow" class="element-group">
          <div class="element-group-title">{{ element.title }}</div>
          <div v-if="element.groupSubTitle" class="element-group-sub-title">
            {{ element.groupSubTitle }}
          </div>
        </div>
        <div class="element-option">
          <ElementNum2
            ref="elementNum"
            class="element-num"
            :min-num="element.minNum"
            :max-num="element.maxNum"
          ></ElementNum2>
          <div v-if="element.maxSubNum > 0" class="element-earn">
            <div class="element-earn-icon">赚</div>
            <div class="element-earn-money pf-medium">
              <template v-if="element.minSubNum == element.maxSubNum">{{
                element.minSubNum
              }}</template>
              <template v-else
                >{{ element.minSubNum }}-{{ element.maxSubNum }}</template
              >
            </div>
          </div>
        </div>
      </div>
    </a>
    <!-- <div class="element-operates">
      <div v-if="inList" class="element-operate-del" @click="elementDelClick">
        删除
      </div>
      <div v-else class="element-operate-add" @click="elementAddClick">
        加入清单
      </div>
      <div class="element-operate-share pf-medium" @click="elementShareClick">
        立即分享
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import { PropType, Ref, ref, toRefs } from 'vue'
import { ElementItemType } from '@/constant/elementItem'
import {
  getElementCheck,
  getElementShare
} from '@/composables/element-item/elementItem'

const emit = defineEmits([
  'add-success',
  'add-exist',
  'add-fail',
  'del-success',
  'del-fail'
])
const props = defineProps({
  element: {
    type: Object as PropType<ElementItemType>,
    default() {
      return {}
    }
  },
  groupTitleShow: {
    type: Boolean,
    default: false
  },
  inList: {
    type: Boolean,
    default: false
  }
})
const { element } = toRefs(props)

const { elementAddClick, elementDelClick } = getElementCheck(
  emit,
  element.value.id
)

const elementNum: Ref<any> = ref(null)
const {
  elementShareStatus,
  elementShareInfo,
  elementShareLoad,
  elementShareClick
} = getElementShare(element)
</script>

<style lang="scss" scoped>
.element-item {
  display: block;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  .element-info {
    display: flex;
    // margin-bottom: 26px;
    .element-image {
      flex: none;
      border-radius: 16px;
      overflow: hidden;
      margin-right: 20px;
    }

    .element-detail {
      flex: 1;
      overflow: hidden;
      .element-title {
        font-size: 28px;
        color: #121212;
        line-height: 42px;
        margin-bottom: 12px;
        @include ellicpsisN(2);
      }
      .element-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        overflow: hidden;
        .element-group-title {
          flex: 1;
          font-size: 22px;
          color: #666666;
          line-height: 28px;
          @include ellicpsis;
        }
        .element-group-sub-title {
          flex: none;
          line-height: 28px;
          font-size: 22px;
          color: #999999;
        }
      }
      .element-option {
        display: flex;
        align-items: center;
        .element-num {
          margin-right: 20px;
        }
        .element-earn {
          display: flex;
          align-items: center;
          border: 2px solid #ff5900;
          border-radius: 30px;
          .element-earn-icon {
            height: 36px;
            line-height: 36px;
            padding-left: 36px;
            padding-right: 4px;
            color: #ffffff;
            font-size: 22px;
            background: url('~@/assets/images/home/icon-money.png') 12px center/
              20px 22px no-repeat;
            background-color: #ff7615;
            border-top-left-radius: 30px;
            border-bottom-left-radius: 30px;
          }
          .element-earn-money {
            height: 36px;
            line-height: 36px;
            padding-left: 4px;
            padding-right: 12px;
            font-size: 22px;
            color: #ff5900;
            @include ellicpsis;
          }
        }
      }
    }
  }
  .element-operates {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20px;
    border-top: 2px solid #ededed;
    .element-operate-add {
      width: 152px;
      height: 60px;
      font-size: 26px;
      line-height: 60px;
      text-align: center;
      margin-right: 20px;
      border: 2px solid #cccccc;
      border-radius: 60px;
    }
    .element-operate-del {
      width: 100px;
      height: 60px;
      font-size: 26px;
      line-height: 60px;
      text-align: center;
      margin-right: 20px;
      border: 2px solid #cccccc;
      border-radius: 60px;
    }
    .element-operate-share {
      width: 152px;
      height: 60px;
      font-size: 26px;
      color: #ff5900;
      border-radius: 30px;
      text-align: center;
      line-height: 60px;
      box-sizing: border-box;
      padding: 2px;
      background-image: linear-gradient(#ffffff, #ffffff),
        linear-gradient(270deg, #ff5900, #ff8800);
      background-clip: content-box, padding-box;
    }
  }
}
</style>
