<template>
  <div class="media-preview">
    <!-- 这里不使用VanOverlay 否则lock-scroll	锁定背景滚动后，锁定时蒙层里的内容也将无法滚动 -->
    <VanPopup v-model:show="vanPopupShow" :close-on-click-overlay="false">
      <div class="close" @click="vanPopupShow = false"></div>
      <div class="medias">
        <VanSwipe
          ref="vanSwipe"
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
                <div class="type-flag">
                  {{ MaterialTypeText[item.materialType] }}
                </div>
              </div>
              <div v-else class="media-image">
                <img :src="item.picUrl" />
                <div class="type-flag">
                  {{ MaterialTypeText[item.materialType] }}
                </div>
              </div>
            </div>
          </VanSwipeItem>
        </VanSwipe>
        <div class="indicators pf-medium">
          {{ currentIndex + 1 }}/{{ medias.length }}
        </div>
      </div>
      <div class="share">
        <div class="share-button" @click="shareClick"><i></i>立即分享</div>
        <div class="share-text">分享时文案会自动复制，长按粘贴即可</div>
      </div>
    </VanPopup>
  </div>
</template>
<script lang="ts" setup>
/* eslint-disable vue/require-default-prop */
import { queryShareKey } from '@/api/common'
import {
  MaterialType,
  MaterialTypeText,
  ShareKeyLinkTypeWorkChat,
  ShareKeyTokenWorkChat,
  ShareKeyToolType,
  ShareMaterialType
} from '@/constant/shareService'
import {
  convertImageBase64ToFile,
  copyTextClipboard,
  getPosterBase64,
  sleep,
  videoPreview
} from '@/utils'
import { ImagePreview, Toast } from 'vant'
import { nextTick, PropType, ref, toRefs, watch } from 'vue'

const props = defineProps({
  taskId: {
    type: Number
  },
  spuId: {
    type: Number
  },
  show: {
    type: Boolean,
    default: false
  },
  medias: {
    type: Object as PropType<ShareMaterialType[]>,
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

const { taskId, spuId, show, medias, initial, copyText } = toRefs(props)

const vanSwipe = ref()

const vanPopupShow = ref(show.value)
const currentIndex = ref(initial.value)

const shareKey = ref('')

watch(show, val => {
  vanPopupShow.value = val
})

watch(vanPopupShow, val => {
  emits('update:show', val)
})

watch(initial, val => {
  currentIndex.value = val
})

const swipeChange = (index: number) => {
  currentIndex.value = index
}

const shareClick = async () => {
  Toast.loading({
    duration: 0,
    forbidClick: true,
    message: '加载中...'
  })
  const copyRes = await copyTextClipboard(copyText.value)
  const media = medias.value[currentIndex.value]
  let imgMediaId = ''
  let videoMediaId = ''
  if (
    media.materialType == MaterialType.BxPoster ||
    media.materialType == MaterialType.Poster
  ) {
    try {
      shareKey.value = await queryShareKey({})
      const posterBase64 = await getPosterBase64(
        media.picUrl,
        media.shareLink,
        shareKey.value
      )
      imgMediaId = posterBase64
    } catch (e: any) {
      // 海报无镂空区域，直接用背景图当素材
      imgMediaId = media.picUrl
    }
  } else if (media.materialType == MaterialType.Image) {
    imgMediaId = media.picUrl
  } else if (media.materialType == MaterialType.Video) {
    videoMediaId = media.picUrl
  }
  if (copyRes) {
    Toast({
      message: '复制分享文案成功，可粘\n贴至输入框内发送～',
      duration: 0
    })
    await sleep(1000)
  }
  const image = imgMediaId ? { mediaid: imgMediaId } : undefined
  const video = videoMediaId ? { mediaid: videoMediaId } : undefined
  Toast('模拟分享成功...')
  await sleep(1500)
  if (image) {
    ImagePreview([image.mediaid])
  } else if (video) {
    videoPreview({
      videoUrl: video.mediaid
    })
  }
}

const quickShare = async () => {
  if (medias.value.length == 0) {
    Toast('没有素材可以分享')
    return
  }
  // 一张素材直接拉起分享
  if (medias.value.length == 1) {
    shareClick()
    return
  }
  let showIndex = 0
  // 优先寻找第一个代码海报
  const firstPoster = medias.value.find((media, index) => {
    if (media.materialType == MaterialType.Poster) {
      showIndex = index
      return true
    } else {
      return false
    }
  })
  if (!firstPoster) {
    // 其次寻找第一个保险海报
    medias.value.find((media, index) => {
      if (media.materialType == MaterialType.BxPoster) {
        showIndex = index
        return true
      } else {
        return false
      }
    })
  }
  vanPopupShow.value = true
  nextTick(() => {
    vanSwipe.value.swipeTo(showIndex, { immediate: true })
  })
}

defineExpose({
  quickShare
})
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
              position: relative;
              width: 100%;
              max-height: 100%;
              overflow-y: auto;
              border-radius: 16px;
              img {
                width: 100%;
                height: auto;
              }
            }
            .type-flag {
              position: absolute;
              box-sizing: border-box;
              top: 0;
              right: 0;
              border-bottom-left-radius: 16px;
              padding: 0 15px;
              height: 28px;
              background: #ff397e;
              color: #ffffff;
              font-size: 18px;
              line-height: 28px;
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
