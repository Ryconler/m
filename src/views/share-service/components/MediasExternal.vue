<template>
  <VanOverlay
    class="progress-overlay"
    :show="show"
    @click="shareButtonShow && (show = false)"
  >
    <div class="progress-wrap" @click.stop>
      <div class="progress-text">
        <div
          class="progress-total pf-medium"
          :class="getStatusClass(allProgressStatus.shareText)"
        >
          <i class="status"></i>
          <span>话术已自动传输</span>
        </div>
      </div>
      <div class="progress-media">
        <div
          class="progress-total pf-medium"
          :class="getStatusClass(allProgressStatus.mediasTotal)"
        >
          <i class="status"></i>
          <span>生成带员工信息图片素材，可记录到顾客访问和销售</span>
        </div>
        <div
          v-for="(item, index) in allProgressStatus.medias"
          :key="index"
          class="progress-media-item"
          :class="getStatusClass(item)"
        >
          <span>第{{ index + 1 }}张</span><i class="status"></i>
        </div>
      </div>
      <div v-if="shareButtonShow" class="share-tip">请选择发送方式</div>
      <div v-if="shareButtonShow" class="progress-buttons">
        <div class="share-contact-button pf-medium" @click="shareContactClick">
          <i></i>客户
        </div>
        <div class="share-chat-button pf-medium" @click="shareChatClick">
          <i></i>客户群
        </div>
        <div class="share-moment-button pf-medium" @click="shareMomentClick">
          <i></i>朋友圈
        </div>
      </div>
      <div v-else class="progress-tip pf-medium">
        正在生成中，请保持打开状态稍等...
      </div>
    </div>
  </VanOverlay>
</template>
<script lang="ts" setup>
import { queryShareKey } from '@/api/common'
import {
  MaterialType,
  ShareKeyLinkTypeWorkChat,
  ShareKeyTokenWorkChat,
  ShareKeyToolType,
  ShareMaterialType
} from '@/constant/shareService'
import {
  convertImageBase64ToFile,
  getPosterBase64,
  sleep,
  videoPreview
} from '@/utils'
import { ImagePreview, Overlay as VanOverlay, Toast } from 'vant'
import { toRefs, ref, PropType, Ref, computed, watch } from 'vue'

const props = defineProps({
  taskId: {
    type: Number
  },
  spuId: {
    type: Number
  },
  medias: {
    type: Object as PropType<ShareMaterialType[]>,
    default() {
      return []
    }
  },
  shareText: {
    type: String,
    default: ''
  }
})
const { taskId, spuId, medias, shareText } = toRefs(props)

const show = ref(false)
const shareKey = ref('')

enum ProgressStatus {
  Initial,
  Processing,
  Success,
  Fail
}

const allProgressStatus: Ref<{
  shareText: ProgressStatus
  medias: ProgressStatus[]
  mediasTotal: ProgressStatus
}> = ref({
  shareText: ProgressStatus.Initial,
  medias: new Array(medias.value.length).fill(ProgressStatus.Initial),
  mediasTotal: ProgressStatus.Initial
})

const shareButtonShow = computed(() => {
  return (
    allProgressStatus.value.shareText != ProgressStatus.Initial &&
    allProgressStatus.value.shareText != ProgressStatus.Processing &&
    allProgressStatus.value.mediasTotal != ProgressStatus.Initial &&
    allProgressStatus.value.mediasTotal != ProgressStatus.Processing
  )
})

const attachmentsParam: Ref<any[]> = ref([])

const attachmentsWithErrorOrEmpty = computed(() => {
  return (
    attachmentsParam.value.length == 0 ||
    allProgressStatus.value.medias.some(item => item == ProgressStatus.Fail)
  )
})

watch(
  medias,
  () => {
    resetAttachmentsParam()
  },
  {
    deep: true
  }
)

function resetAttachmentsParam() {
  attachmentsParam.value = []
  allProgressStatus.value = {
    shareText: ProgressStatus.Initial,
    medias: new Array(medias.value.length).fill(ProgressStatus.Initial),
    mediasTotal: ProgressStatus.Initial
  }
}

const getStatusClass = (status: ProgressStatus) => {
  let className = ''
  switch (status) {
    case ProgressStatus.Initial:
      className = 'initial'
      break
    case ProgressStatus.Processing:
      className = 'processing'
      break
    case ProgressStatus.Success:
      className = 'success'
      break
    case ProgressStatus.Fail:
      className = 'fail'
      break
    default:
      break
  }
  return className
}

const getAttachmentsParam = async () => {
  resetAttachmentsParam()
  /* 话术 */
  allProgressStatus.value.shareText = ProgressStatus.Success
  /* 素材 */
  allProgressStatus.value.mediasTotal = ProgressStatus.Processing
  shareKey.value = await queryShareKey({})
  for (const index in medias.value) {
    allProgressStatus.value.medias[index] = ProgressStatus.Processing
    const material = medias.value[index]
    let result = false
    if (
      material.materialType == MaterialType.BxPoster ||
      material.materialType == MaterialType.Poster
    ) {
      try {
        const posterBase64 = await getPosterBase64(
          material.picUrl,
          material.shareLink,
          shareKey.value
        )
        const mediaid = posterBase64
        attachmentsParam.value.push({
          msgtype: 'image',
          image: {
            mediaid
          }
        })
        result = !!mediaid
      } catch (e) {
        // 海报无镂空区域，直接用背景图当素材
        attachmentsParam.value.push({
          msgtype: 'image',
          image: {
            imgUrl: material.picUrl
          }
        })
        result = true
      }
    } else if (material.materialType == MaterialType.Image) {
      attachmentsParam.value.push({
        msgtype: 'image',
        image: {
          imgUrl: material.picUrl
        }
      })
      result = true
    } else if (material.materialType == MaterialType.Video) {
      const mediaid = material.picUrl
      attachmentsParam.value.push({
        msgtype: 'video',
        video: {
          mediaid
        }
      })
      result = !!mediaid
    }
    allProgressStatus.value.medias[index] = result
      ? ProgressStatus.Success
      : ProgressStatus.Fail
  }
  allProgressStatus.value.mediasTotal = ProgressStatus.Success
}

const shareToExternal = async () => {
  attachmentsWithErrorOrEmpty.value && getAttachmentsParam()
  show.value = true
}

/* 发表内容到客户朋友圈 */
const shareMomentClick = async () => {
  // 图片与视频数量限制处理
  const iamgeAttachments: any[] = []
  const videoAttachments: any[] = []
  attachmentsParam.value.forEach(item => {
    if (
      item.msgtype == 'image' &&
      (item.image?.mediaid || item.image?.imgUrl)
    ) {
      iamgeAttachments.push(item)
    } else if (item.msgtype == 'video' && item.video?.mediaid) {
      videoAttachments.push(item)
    }
  })
  if (iamgeAttachments.length > 0 && videoAttachments.length > 0) {
    Toast({
      message: '视频不能与图片同时发表朋友圈，已自动过滤',
      duration: 0,
      forbidClick: true
    })
    await sleep(1500)
  }
  if (iamgeAttachments.length > 9) {
    Toast({
      message: '图片最多支持九张，已自动保留前九张',
      duration: 0,
      forbidClick: true
    })
    iamgeAttachments.splice(9, iamgeAttachments.length - 9)
    await sleep(1500)
  }
  if (videoAttachments.length > 1) {
    Toast({
      message: '视频只支持一个，已自动保留第一个',
      duration: 0,
      forbidClick: true
    })
    videoAttachments.splice(1, 1)
    await sleep(1500)
  }
  Toast({
    message: '正在前往发送页...',
    duration: 0,
    forbidClick: true
  })
  Toast('模拟分享成功...')
  await sleep(1500)
  if (iamgeAttachments.length > 0) {
    ImagePreview(
      iamgeAttachments.map(item => item.image?.mediaid || item.image?.imgUrl)
    )
  } else if (videoAttachments.length > 0) {
    videoPreview({
      videoUrl: videoAttachments[0].mediaid
    })
  }
}

/* 群发消息给客户 */
const shareContactClick = async () => {
  Toast({
    message: '正在前往发送页...',
    duration: 0,
    forbidClick: true
  })
  Toast('模拟群发成功...')
  await sleep(1500)
  ImagePreview(
    attachmentsParam.value.map(
      item => item.image?.mediaid || item.image?.imgUrl
    )
  )
}

/* 群发消息到客户群 */
const shareChatClick = async () => {
  Toast({
    message: '正在前往发送页...',
    duration: 0,
    forbidClick: true
  })
  Toast('模拟群发成功...')
  await sleep(1500)
  ImagePreview(
    attachmentsParam.value.map(
      item => item.image?.mediaid || item.image?.imgUrl
    )
  )
}

defineExpose({
  shareToExternal
})
</script>
<style lang="scss" scoped>
.progress-overlay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .progress-wrap {
    box-sizing: border-box;
    width: 670px;
    background: #ffffff;
    border-radius: 16px;
    padding: 32px 24px 50px;
    .progress-text {
      margin-bottom: 34px;
    }
    .progress-media {
      margin-bottom: 50px;
    }
    .progress-total {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      i {
        flex: none;
        width: 40px;
        height: 40px;
        margin-right: 20px;
      }
      span {
        flex: 1;
        font-size: 28px;
        line-height: 34px;
        color: #15161f;
      }
    }
    .progress-media-item {
      padding-left: 64px;
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:last-child {
        margin-bottom: 0;
      }
      span {
        flex: 1;
        font-size: 24px;
        color: #15161f;
      }
      i {
        flex: none;
        width: 32px;
        height: 32px;
      }
    }
    .share-tip {
      text-align: center;
      font-size: 24px;
      color: #15161f;
      margin-bottom: 20px;
    }
    .progress-buttons {
      display: flex;
      justify-content: center;
      .share-contact-button {
        padding: 0 24px;
        height: 75px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: 3px solid #5aa945;
        border-radius: 75px;
        font-size: 30px;
        color: #5aa945;
        margin-right: 14px;
        i {
          width: 38px;
          height: 38px;
          margin-right: 12px;
          background: url('@/assets/images/share-service/icon-contact.png') 0 0/100%
            100% no-repeat;
        }
      }
      .share-chat-button {
        padding: 0 24px;
        height: 75px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: 3px solid #5aa945;
        border-radius: 75px;
        font-size: 30px;
        color: #5aa945;
        margin-right: 14px;
        i {
          width: 38px;
          height: 38px;
          margin-right: 12px;
          background: url('@/assets/images/share-service/icon-chat.png') 0 0/100%
            100% no-repeat;
        }
      }
      .share-moment-button {
        padding: 0 24px;
        height: 75px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: 3px solid #5aa945;
        border-radius: 75px;
        font-size: 30px;
        color: #5aa945;
        i {
          width: 38px;
          height: 38px;
          margin-right: 12px;
          background: url('@/assets/images/share-service/icon-moment.png') 0 0/100%
            100% no-repeat;
        }
      }
    }
    .progress-tip {
      text-align: center;
      font-size: 28px;
      line-height: 34px;
      color: #282828;
    }
  }
}

/* 状态图标 */
i.status {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: 0 0;
}
.initial i.status {
  background-color: transparent;
}
.processing i.status {
  background-image: url('@/assets/images/share-service/icon-loading.png');
  animation: rotate 1s infinite linear;
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
.success i.status {
  background-image: url('@/assets/images/share-service/icon-success.png');
}
.fail i.status {
  background-image: url('@/assets/images/share-service/icon-fail.png');
}
</style>
