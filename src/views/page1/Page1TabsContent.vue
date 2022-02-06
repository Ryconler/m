<template>
  <div class="tabs-content">
    <div v-if="showTabName" class="content-title pf-simbold">{{ tabname }}</div>
    <div v-if="themes.length > 0" class="themes">
      <div v-for="item in themes" :key="item.id" class="theme">
        <div class="theme-title pf-medium">
          {{ item.name }}（{{ item.images ? item.images.length : 0 }}）
        </div>
        <div class="theme-pics">
          <BaseImg
            v-for="(item2, index2) in item.images"
            :key="index2"
            class="theme-pic"
            width="210"
            height="280"
            :src="item2"
            @click="themePicClick(item, index2)"
          />
        </div>
      </div>
    </div>
    <div v-if="elements.length > 0" class="elements">
      <div class="elements-title pf-medium"><i></i>套餐推荐</div>
      <div class="elements-list">
        <a
          v-for="item in elements"
          :key="item.id"
          class="element"
          :href="item.link"
        >
          <div class="element-detail">
            <BaseImg
              class="element-image"
              width="120"
              height="120"
              :src="item.image"
            />
            <div class="element-info">
              <div class="element-title">{{ item.title }}</div>
              <div v-if="item.subTitle" class="element-sub-title">
                {{ item.subTitle }}
              </div>
              <ElementNum class="element-num-wrap" :num="item.minNum" />
            </div>
            <div class="element-btn pf-medium">查看详情</div>
          </div>
          <div v-if="item.desc" class="element-recommend">
            <div class="element-recommend-icon">
              <i></i><span class="pf-medium">推荐</span>
            </div>
            <div class="element-recommend-text">
              {{ item.desc }}
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType, toRefs } from 'vue'
import {
  Page1ContentElementType,
  Page1ContentThemeType
} from '@/constant/page1'

const props = defineProps({
  showTabName: {
    type: Boolean,
    default() {
      return true
    }
  },
  tabname: {
    type: String,
    default: ''
  },
  themes: {
    type: Array as PropType<Page1ContentThemeType[]>,
    default() {
      return []
    }
  },
  elements: {
    type: Array as PropType<Page1ContentElementType[]>,
    default() {
      return []
    }
  }
})
const { tabname } = toRefs(props)

const emit = defineEmits(['theme-pic-click'])

const themePicClick = (theme: Page1ContentThemeType, picIndex: number) => {
  emit('theme-pic-click', theme, picIndex)
}
</script>
<style lang="scss" scoped>
.tabs-content {
  overflow: hidden;
  background: linear-gradient(180deg, #fff7f4, #ffffff 21%, #ffffff);
  & > div:last-child {
    margin-bottom: 32px;
  }
  .content-title {
    position: relative;
    font-size: 32px;
    color: #451a0c;
    text-align: center;
    line-height: 64px;
    padding-top: 20px;
    background: url('@/assets/images/page1/bg-title.png') 0 0/100% auto
      no-repeat;
  }
  .themes {
    .theme {
      .theme-title {
        padding: 40px 24px 24px;
        height: 36px;
        overflow: hidden;
        font-size: 30px;
        line-height: 36px;
        @include ellicpsis;
      }
      .theme-pics {
        display: flex;
        overflow-x: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .theme-pic {
          flex: none;
          margin-right: 20px;
          &:first-child {
            padding-left: 24px;
          }
          &:last-child {
            margin-right: 0;
            padding-right: 24px;
          }
          & :deep(img) {
            border-radius: 16px;
          }
        }
      }
    }
  }
  .elements {
    background: url('@/assets/images/page1/bg-elements.png') 0 0/100% auto
      no-repeat;
    .elements-title {
      display: flex;
      align-items: center;
      padding: 48px 24px 24px;
      color: #262626;
      line-height: 36px;
      font-size: 30px;
      i {
        display: block;
        width: 36px;
        height: 36px;
        background: url('@/assets/images/page1/icon-recommend.png') 0 0/100%
          auto no-repeat;
        margin-right: 8px;
      }
    }
    .elements-list {
      margin: 0 24px;
      background: #ffffff;
      box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      .element {
        display: block;
        padding: 24px 0;
        margin: 0 20px;
        &:not(:last-child) {
          border-bottom: 2px solid #ededed;
        }
        .element-detail {
          display: flex;
          position: relative;
          .element-image {
            border-radius: 8px;
            overflow: hidden;
          }
          .element-info {
            flex: 1;
            padding: 0 20px;
            overflow: hidden;
            .element-title {
              font-size: 26px;
              line-height: 32px;
              margin-bottom: 8px;
              color: #121212;
              @include ellicpsis;
            }
            .element-sub-title {
              font-size: 20px;
              color: #444444;
              line-height: 32px;
              margin-bottom: 4px;
              @include ellicpsis;
            }
            .element-num-wrap {
              height: 44px;
            }
          }
          .element-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 26px;
            color: #ff5900;
            line-height: 30px;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 152px;
            height: 60px;
            /* 圆角渐变边框 */
            box-sizing: border-box;
            border-radius: 30px;
            padding: 2px;
            background-image: linear-gradient(#ffffff, #ffffff),
              linear-gradient(270deg, #ff5900, #ff8800);
            background-clip: content-box, padding-box;
          }
        }
        .element-recommend {
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          overflow: hidden;
          margin-top: 10px;
          border-radius: 4px;
          .element-recommend-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 40px;
            background: #ffe9b4;
            border-radius: 4px;
            i {
              display: block;
              width: 28px;
              height: 28px;
              background: url('@/assets/images/page1/icon-good.png') 0 0/100%
                100% no-repeat;
              margin-right: 8px;
            }
            span {
              font-size: 22px;
              color: #ff5900;
              line-height: 24px;
            }
          }
          .element-recommend-text {
            padding: 0 24px;
            font-size: 22px;
            color: #ff8800;
            height: 40px;
            line-height: 40px;
            background: #fff6e2;
          }
        }
      }
    }
  }
}
</style>
