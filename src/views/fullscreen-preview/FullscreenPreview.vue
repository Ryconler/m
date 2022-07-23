<template>
  <VanImagePreview.Component
    id="image-preview"
    v-model:show="isShow"
    :images="images"
    :start-position="startPosition"
    :close-on-popstate="false"
    teleport="body"
    @change="imageChange"
  >
    <template #index>
      <div class="slot-index">
        <!-- 返回按钮 -->
        <div class="back-icon" @click="isShow = false"></div>
        <!-- 索引文字 -->
        <div class="index-text pf-medium">
          <span>{{ imageIndex + 1 }}</span>
          <span class="gray">/{{ images.length }}</span>
        </div>
      </div>
    </template>
  </VanImagePreview.Component>
</template>
<script lang="ts" setup>
import { ImagePreview as VanImagePreview } from 'vant'
import {
  useShow,
  useImages
} from '../../composables/fullscreen-preview/fullscreenPreview'

const { isShow } = useShow()
const { images, startPosition, imageIndex, imageChange } = useImages()
</script>
<style lang="scss">
#image-preview {
  display: flex;
  flex-direction: column;
  height: auto;
  bottom: 0;
  .van-image-preview__swipe {
    height: auto;
    flex: 1;
    .van-image-preview__image {
      .image-detail {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        .theme-title {
          height: 168px;
          padding: 101px 24px 31px;
          box-sizing: border-box;
          background-image: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.13) 24%,
            rgba(0, 0, 0, 0.8)
          );
          font-size: 30px;
          color: #ffffff;
          line-height: 36px;
          @include ellipsis;
        }
      }
    }
    .van-image-preview__image.van-image-preview__image--vertical {
      img {
        width: auto;
      }
    }
  }
  .van-image-preview__index {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    transform: none;
    line-height: initial;
    text-shadow: none;
    .slot-index {
      height: 88px;
      .back-icon {
        position: absolute;
        left: 18px;
        bottom: 20px;
        width: 44px;
        height: 44px;
        background: url('~@/assets/images/photography/icon-back.png') 0 0/100%
          100% no-repeat;
      }
      .index-text {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        line-height: 50px;
        font-size: 36px;
        color: #ffffff;
        .gray {
          color: #999999;
        }
      }
    }
  }
  .van-image-preview__cover {
    position: relative;
    background: #ffffff;
  }
}
</style>
