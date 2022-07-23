<template>
  <div class="media-preview">
    <VanPopup v-model:show="vanPopupShow" :close-on-click-overlay="false">
      <div class="close" @click="vanPopupShow = false"></div>
      <div class="medias">
        <VanSwipe
          :loop="false"
          :show-indicators="false"
          :initial-swipe="initial"
          @change="swipeChange"
        >
          <VanSwipeItem v-for="(item, index) in medias" :key="index">
            <div class="media" :class="currentIndex == index && 'active'">
              <div
                v-if="item.materialType == MaterialType.Video"
                class="media-video"
              >
                <video
                  :src="`${item.picUrl}\#t=0.1`"
                  preload="metadata"
                  controls
                ></video>
              </div>
              <div v-else class="media-image">
                <img :src="item.picUrl" />
              </div>
            </div>
          </VanSwipeItem>
        </VanSwipe>
        <div class="indicators pf-medium">
          {{ currentIndex + 1 }}/{{ medias.length }}
        </div>
      </div>
      <div class="share">
        <div class="share-button" @click="shareClick"><i></i>分享到群</div>
        <div class="share-text">分享时文案会自动复制，长按粘贴即可</div>
      </div>
    </VanPopup>
  </div>
</template>
<script lang="ts" setup>
import { MaterialType } from '@/constant/shareService'
import { convertImageBase64ToFile, copyTextClipboard } from '@/utils'
import { Toast } from 'vant'
import { PropType, ref, toRefs, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  medias: {
    type: Object as PropType<any[]>,
    default() {
      return []
    }
  },
  initial: {
    type: Number,
    default: 0
  },
  copyText: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:show'])

const { show, medias, initial, copyText } = toRefs(props)

const vanPopupShow = ref(show.value)
const currentIndex = ref(initial.value)

watch(show, val => {
  vanPopupShow.value = val
})

watch(vanPopupShow, val => {
  emits('update:show', val)
})

const swipeChange = (index: number) => {
  currentIndex.value = index
}

const shareClick = async () => {
  Toast.loading({
    duration: 0,
    forbidClick: true
  })
  await copyTextClipboard(copyText.value)
  const media = medias.value[currentIndex.value]

  let imgUrl = ''
  let imgMediaId = ''
  let videoUrl = ''
  if (
    media.materialType == MaterialType.BxPoster ||
    media.materialType == MaterialType.Poster
  ) {
    imgUrl = media.picUrl
  } else if (media.materialType == MaterialType.Image) {
    imgUrl = media.picUrl
  } else if (media.materialType == MaterialType.Video) {
    videoUrl = media.picUrl
  }
  Toast('分享成功')
}
</script>
<style lang="scss" scoped>
.media-preview {
  :deep(.van-popup) {
    position: fixed;
    background: transparent;
    top: 0;
    left: 0;
    transform: none;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .close {
      position: absolute;
      top: 48px;
      right: 48px;
      width: 44px;
      height: 44px;
      background: url('@/assets/images/media-preview/icon-close.png') 0 0/100%
        100% no-repeat;
    }
    .medias {
      margin: 280px 0 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .van-swipe {
        width: 544px;
        height: 630px;
        overflow: visible;
        margin-bottom: 44px;
        .van-swipe-item {
          .media {
            width: 100%;
            height: 100%;
            border-radius: 16px;
            overflow: hidden;
            transform: scale(0.815);
            transition: transform 0.3s ease-in-out;
            display: flex;
            align-items: center;
            &.active {
              transform: scale(1);
            }
            .media-video {
              width: 100%;
              height: 100%;
              position: relative;
              video {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .play-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 120px;
                height: 120px;
                background: url('@/assets/images/media-preview/icon-play.png') 0
                  0/100% 100% no-repeat;
              }
            }
            .media-image {
              width: 100%;
              max-height: 100%;
              overflow-y: auto;
              img {
                width: 100%;
                height: auto;
              }
            }
          }
        }
      }
      .indicators {
        font-size: 32px;
        color: #ffffff;
      }
    }
    .share {
      display: flex;
      flex-direction: column;
      align-items: center;
      .share-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 24px;
        color: #ffffff;
        margin-bottom: 24px;
        i {
          width: 96px;
          height: 96px;
          background: url('@/assets/images/media-preview/icon-workchat.png') 0 0/100%
            100% no-repeat;
          margin-bottom: 12px;
        }
      }
      .share-text {
        font-size: 24px;
        color: #ffffff;
        line-height: 30px;
      }
    }
  }
}
</style>
