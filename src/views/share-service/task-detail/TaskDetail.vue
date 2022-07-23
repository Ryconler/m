<template>
  <div v-if="taskDetail" class="task-detail">
    <div v-if="statusMaterials.length > 0">
      <div class="materials">
        <div
          v-for="(item, index) in statusMaterials"
          :key="index"
          class="material"
        >
          <div
            v-if="item.materialType == MaterialType.Video"
            class="material-video"
            @click="videoClick(index)"
          >
            <video :src="`${item.picUrl}\#t=0.1`" preload="metadata"></video>
            <i class="play-icon"></i>
          </div>
          <BaseImg
            v-else
            :src="item.picUrl"
            :width="212"
            :height="212"
            @click="imageClick(index)"
          />
          <VanCheckbox v-model="item.checked"></VanCheckbox>
        </div>
      </div>
      <div class="tip">*视频需点击后下载，仅支持下载到相册再分享</div>
    </div>
    <div v-if="taskDetail.shareArticle" class="desc">
      <div class="desc-text">{{ taskDetail.shareArticle }}</div>
      <div class="desc-function">
        <div class="count">{{ taskDetail.shareArticle.length }}/100</div>
        <div class="copy-button" @click="copyClick">复制推荐语</div>
      </div>
    </div>
    <div class="channels">
      <div class="channel" @click="wechatClick">
        <img src="@/assets/images/share-service/icon-wechat.png" />
        <span>微信好友</span>
      </div>
      <div class="channel" @click="momentClick">
        <img src="@/assets/images/share-service/icon-moment.png" />
        <span>朋友圈</span>
      </div>
      <div class="channel" @click="downloadClick">
        <img src="@/assets/images/share-service/icon-download.png" />
        <span>下载素材</span>
      </div>
    </div>

    <VanOverlay class="share-overlay" :show="dialogShow">
      <div class="share-dialog">
        <!-- 复制、保存进度 -->
        <div class="share-progress">
          <div
            v-if="dialogCopyStatus == OperationStatus.Loading"
            class="share-progress-item loading"
          >
            分享推荐语正在复制…
          </div>
          <div
            v-else-if="dialogCopyStatus == OperationStatus.Succeed"
            class="share-progress-item success"
          >
            分享推荐语已复制
          </div>
          <div
            v-else-if="dialogCopyStatus == OperationStatus.Failed"
            class="share-progress-item fail"
          >
            分享推荐语复制失败
          </div>
          <div
            v-if="dialogDownloadStatus == OperationStatus.Loading"
            class="share-progress-item loading"
          >
            图片/视频正在保存到相册…
          </div>
          <div
            v-else-if="dialogDownloadStatus == OperationStatus.Succeed"
            class="share-progress-item success"
          >
            图片/视频已保存到相册
          </div>
          <div
            v-else-if="dialogDownloadStatus == OperationStatus.Failed"
            class="share-progress-item fail"
          >
            图片/视频保存相册失败
          </div>
        </div>
        <!-- 分享微信好友 -->
        <div v-if="dialogType == DialogType.ShareWxChat" class="share-content">
          <div class="share-title">分享给微信好友</div>
          <div class="share-tutorial">
            <div class="share-tutorial-item">打开<br />微信</div>
            <i class="share-tutorial-arrow"></i>
            <div class="share-tutorial-item">粘贴文案<br />上传图片/视频</div>
            <i class="share-tutorial-arrow"></i>
            <div class="share-tutorial-item">确认<br />分享</div>
          </div>
          <button
            class="share-button"
            :disabled="
              dialogCopyStatus == OperationStatus.Loading ||
              dialogDownloadStatus == OperationStatus.Loading
            "
            @click="Toast('模拟原生打开微信成功...')"
          >
            <i></i>打开微信
          </button>
        </div>
        <!-- 分享微信朋圈 -->
        <div
          v-else-if="dialogType == DialogType.ShareWxMoment"
          class="share-content"
        >
          <div class="share-title">分享到朋友圈</div>
          <div class="share-tutorial">
            <div class="share-tutorial-item">打开<br />微信</div>
            <i class="share-tutorial-arrow"></i>
            <div class="share-tutorial-item">打开<br />朋友圈</div>
            <i class="share-tutorial-arrow"></i>
            <div class="share-tutorial-item">粘贴文案<br />上传图片/视频</div>
            <i class="share-tutorial-arrow"></i>
            <div class="share-tutorial-item">确认<br />分享</div>
          </div>
          <button
            class="share-button"
            :disabled="
              dialogCopyStatus == OperationStatus.Loading ||
              dialogDownloadStatus == OperationStatus.Loading
            "
            @click="Toast('xxx')"
          >
            <i></i>打开微信
          </button>
        </div>
        <!-- 下载素材 -->
        <div
          v-else-if="dialogType == DialogType.Download"
          class="share-content"
        >
          <div
            v-if="
              dialogCopyStatus == OperationStatus.Loading ||
              dialogDownloadStatus == OperationStatus.Loading
            "
            class="download-title"
          >
            正在保存中，请保持打开状态稍等…
          </div>
          <button v-else class="close-button" @click="dialogShow = false">
            保存完成
          </button>
        </div>
        <div class="share-close" @click="dialogShow = false"></div>
      </div>
    </VanOverlay>
  </div>
</template>
<script lang="ts" setup>
import { Overlay as VanOverlay } from 'vant'
import {
  copyTextClipboard,
  setLoading,
  getPosterBase64,
  videoPreview,
  sleep,
  getImageBase64
} from '@/utils'
import { computed, onMounted, Ref, ref } from 'vue'
import {
  Checkbox as VanCheckbox,
  Toast,
  ImagePreview as VanImagePreview
} from 'vant'
import { useRoute } from 'vue-router'
import {
  MaterialType,
  ShareMaterialType,
  ShareTaskType
} from '@/constant/shareService'
import { useLocation } from '@/composables/common'
import { queryShareTask } from '@/api/shareService'
import { get } from 'lodash'
import { queryShareKey } from '@/api/common'

enum DialogType {
  ShareWxChat,
  ShareWxMoment,
  Download
}
enum OperationStatus {
  Loading,
  Succeed,
  Failed
}

setLoading(true)

const route = useRoute()

const shareKey = ref('')

const taskDetail: Ref<ShareTaskType | null> = ref(null)
const statusMaterials: Ref<(ShareMaterialType & { checked: boolean })[]> = ref(
  []
)
const selectedImgs = computed(() => {
  return statusMaterials.value.filter(
    item => item.checked && item.materialType != MaterialType.Video
  )
})
const selectedVideos = computed(() => {
  return statusMaterials.value.filter(
    item => item.checked && item.materialType == MaterialType.Video
  )
})
const dialogShow = ref(false)

const dialogType = ref(DialogType.ShareWxChat)
const dialogCopyStatus = ref(OperationStatus.Loading)
const dialogDownloadStatus = ref(OperationStatus.Loading)

const { cityInfo } = useLocation({ districts: false })

const cityId = computed(() => {
  return <string>route.query.cityId || cityInfo.value.cityId
})

onMounted(async () => {
  const taskList = (await queryShareTask(cityId.value)).shareTaskList || []
  const taskId = Number(route.params.taskId)
  taskDetail.value = taskList.find(item => item.id == taskId) || null
  if (taskDetail.value && taskDetail.value.shareMaterialList) {
    if (taskDetail.value.shareMaterialList.length == 1) {
      // 一张图的时候 默认选中
      statusMaterials.value = [
        {
          ...taskDetail.value.shareMaterialList[0],
          checked: true
        }
      ]
    } else {
      // 多张图默认选中第一张海报  如果没有海报选中第一张保险海报 都没有不选中
      const hasPoster = taskDetail.value.shareMaterialList.some(
        item => item.materialType == MaterialType.Poster
      )
      let firstChecked = false //首张海报是否已选取
      statusMaterials.value = taskDetail.value.shareMaterialList.map(item => {
        const status = {
          ...item,
          checked: false
        }
        if (
          !firstChecked &&
          (hasPoster
            ? item.materialType == MaterialType.Poster
            : item.materialType == MaterialType.BxPoster)
        ) {
          status.checked = true
          firstChecked = true
        }
        return status
      })
    }
  }
  shareKey.value = await queryShareKey({})
  setLoading(false)
})

const imageClick = (originIndex: number) => {
  let beforeVideoNum = 0 //点击图片之前视频的数量
  const imgUrls =
    taskDetail.value && taskDetail.value.shareMaterialList
      ? taskDetail.value.shareMaterialList
          .filter((item, index) => {
            if (item.materialType == MaterialType.Video) {
              index < originIndex && beforeVideoNum++
              return false
            } else {
              return true
            }
          })
          .map(item => item.picUrl)
      : []
  VanImagePreview({
    images: imgUrls,
    startPosition: originIndex - beforeVideoNum
  })
}

const videoClick = (index: number) => {
  videoPreview({
    videoUrl: get(taskDetail.value, `shareMaterialList[${index}].picUrl`, '')
  })
}

const copyClick = async () => {
  const res = await copyTextClipboard(taskDetail.value?.shareArticle)
  if (res) {
    Toast('复制成功')
  } else {
    Toast('复制失败')
  }
}

const wechatClick = async () => {
  Toast.loading({
    duration: 0,
    forbidClick: true,
    message: '加载中...'
  })
  try {
    const res = await copyTextClipboard(taskDetail.value?.shareArticle) // 需要放到setShareInfo前面执行，不然复制不成功
    await setShareInfo()
    if (res) {
      Toast({
        message: '复制推荐语成功',
        duration: 0
      })
      await sleep(1000)
    }
    // 拉起微信好友分享
    Toast('模拟原生拉起微信成功...')
  } catch (err) {
    if (err == 'no media') {
      Toast('请选择图片/视频')
    } else if (err == 'invalid media') {
      // 选择了多个图片或视频，走下载逻辑
      Toast.clear()
      handleCopyAndSave(false, DialogType.ShareWxChat)
    } else {
      Toast('分享失败')
    }
  }
}

const momentClick = async () => {
  Toast.loading({
    duration: 0,
    forbidClick: true,
    message: '加载中...'
  })
  try {
    const res = await copyTextClipboard(taskDetail.value?.shareArticle)
    await setShareInfo()
    if (res) {
      Toast({
        message: '复制推荐语成功',
        duration: 0
      })
      await sleep(1000)
    }
    // 拉起微信朋友圈分享
    Toast('模拟原生拉起微信朋友圈成功...')
  } catch (err) {
    if (err == 'no media') {
      Toast('请选择图片/视频')
    } else if (err == 'invalid media') {
      // 选择了多个图片或视频，走下载逻辑
      Toast.clear()
      handleCopyAndSave(false, DialogType.ShareWxMoment)
    } else {
      Toast('分享失败')
    }
  }
}

const downloadClick = () => {
  if (selectedImgs.value.length == 0 && selectedVideos.value.length == 0) {
    Toast('请选择图片/视频')
    return
  }
  handleCopyAndSave(false, DialogType.Download)
}

/* 设置分享信息 */
async function setShareInfo() {
  if (selectedImgs.value.length == 0 && selectedVideos.value.length == 0) {
    throw 'no media'
  } else if (
    selectedImgs.value.length == 1 &&
    selectedVideos.value.length == 0
  ) {
    //只选了一张图片
    try {
      const selectedImg = selectedImgs.value[0]
      let base64 = ''
      if (
        selectedImg.materialType == MaterialType.BxPoster ||
        selectedImg.materialType == MaterialType.Poster
      ) {
        try {
          base64 = await getPosterBase64(
            selectedImg.picUrl,
            selectedImg.spuId,
            selectedImg.shareLink,
            shareKey.value
          )
        } catch (e) {
          base64 = await getImageBase64(selectedImg.picUrl)
        }
      } else {
        base64 = await getImageBase64(selectedImg.picUrl)
      }
      return 'setImageShare success'
    } catch (e) {
      throw 'getImageBase64 fail'
    }
  } else {
    throw 'invalid media'
  }
}

/* 复制推荐语、保存图片视频，默认静默下载不显示弹窗 */
async function handleCopyAndSave(silence = true, type = DialogType.Download) {
  if (!silence) {
    dialogShow.value = true
    dialogType.value = type
    dialogCopyStatus.value = OperationStatus.Loading
    dialogDownloadStatus.value = OperationStatus.Loading
  }
  const res = await copyTextClipboard(taskDetail.value?.shareArticle)
  if (!silence) {
    dialogCopyStatus.value = res
      ? OperationStatus.Succeed
      : OperationStatus.Failed
  }
  await sleep(500)
  const mediaUrls: string[] = []
  const posterPromises: Promise<string>[] = []
  for (const material of statusMaterials.value) {
    if (material.checked) {
      if (
        material.materialType == MaterialType.BxPoster ||
        material.materialType == MaterialType.Poster
      ) {
        posterPromises.push(
          new Promise(resolve => {
            getPosterBase64(material.picUrl, material.shareLink, shareKey.value)
              .then(poster => {
                mediaUrls.push(poster)
                resolve('success')
              })
              .catch(() => {
                mediaUrls.push(material.picUrl)
                resolve('success')
              })
          })
        )
      } else {
        mediaUrls.push(material.picUrl)
      }
    }
  }
  // 所有海报生成成功后，保存图片视频
  Promise.all(posterPromises).then(() => {
    console.log('开始保存图片/视频')
    dialogDownloadStatus.value = OperationStatus.Succeed
  })
}
</script>

<style lang="scss" scoped>
.task-detail {
  padding: 24px 32px;
  .materials {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 12px;
    .material {
      position: relative;
      width: 212px;
      height: 212px;
      margin-right: 24px;
      margin-bottom: 24px;
      border-radius: 8px;
      overflow: hidden;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &:nth-last-child(1),
      &:nth-last-child(2),
      &:nth-last-child(3) {
        margin-bottom: 0;
      }
      .material-video {
        position: relative;
        width: 100%;
        height: 100%;
        video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }
        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          background: url('@/assets/images/share-service/icon-play.png') 0 0/100%
            100% no-repeat;
          z-index: 2;
        }
      }
      .van-checkbox {
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 12px;
        :deep(.van-checkbox__icon) {
          font-size: 40px;
          &.van-checkbox__icon {
            .van-icon {
              background-color: #ffffff;
              border-color: rgba(214, 214, 214, 1);
            }
          }
          &.van-checkbox__icon--checked {
            .van-icon {
              background-color: #ff397e;
              border-color: #ff397e;
            }
          }
        }
      }
    }
  }
  .tip {
    font-size: 26px;
    color: #ff5900;
    line-height: 37px;
    margin-bottom: 40px;
  }
  .desc {
    padding: 20px 24px;
    background: #f9f9fb;
    border-radius: 12px;
    margin-bottom: 40px;
    .desc-text {
      font-size: 24px;
      color: #666666;
      line-height: 36px;
      word-break: break-all;
      white-space: pre-wrap;
      margin-bottom: 20px;
    }
    .desc-function {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .count {
        font-size: 24px;
        color: #bebebe;
      }
      .copy-button {
        width: 170px;
        height: 48px;
        border: 2px solid rgba(253, 70, 126, 1);
        border-radius: 30px;
        line-height: 48px;
        text-align: center;
        font-size: 26px;
        color: #fd467e;
      }
    }
  }
  .channels {
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    .channel {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        margin-bottom: 12px;
      }
      span {
        font-size: 24px;
        color: #666666;
      }
    }
  }
}
.share-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  .share-dialog {
    width: 580px;
    display: flex;
    align-items: center;
    flex-direction: column;
    .share-progress {
      width: 100%;
      height: 224px;
      background: url('@/assets/images/share-service/bg-share_progress.png') 0 0/100%
        100% no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 102px;
      box-sizing: border-box;
      .share-progress-item {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        height: 36px;
        font-size: 26px;
        color: #262626;
        &:last-child {
          margin-bottom: 0;
        }
        &.loading::before {
          content: '';
          display: block;
          width: 28px;
          height: 28px;
          background: url('@/assets/images/share-service/icon-loading.png') 0 0/100%
            100% no-repeat;
          margin-right: 24px;
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
        &.success::before {
          content: '';
          display: block;
          width: 28px;
          height: 28px;
          background: url('@/assets/images/share-service/icon-success.png') 0 0/100%
            100% no-repeat;
          margin-right: 24px;
        }
        &.fail::before {
          content: '';
          display: block;
          width: 28px;
          height: 28px;
          background: url('@/assets/images/share-service/icon-fail.png') 0 0/100%
            100% no-repeat;
          margin-right: 24px;
        }
      }
    }
    .share-content {
      width: 100%;
      background: #ffffff;
      padding: 40px 0 48px;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      margin-bottom: 44px;
      display: flex;
      align-items: center;
      flex-direction: column;
      .share-title {
        display: flex;
        align-items: center;
        height: 42px;
        font-size: 30px;
        color: #262626;
        margin-bottom: 38px;
        &::before {
          content: '';
          display: block;
          width: 36px;
          height: 1px;
          background: #d8d8d8;
          margin-right: 16px;
        }
        &::after {
          content: '';
          display: block;
          width: 36px;
          height: 1px;
          background: #d8d8d8;
          margin-left: 16px;
        }
      }
      .share-tutorial {
        display: flex;
        align-items: center;
        margin-bottom: 48px;
        .share-tutorial-item {
          text-align: center;
          line-height: 36px;
          font-size: 26px;
          color: #262626;
        }
        .share-tutorial-arrow {
          width: 40px;
          height: 28px;
          background: url('@/assets/images/share-service/icon-arrow.png') 0 0/100%
            100% no-repeat;
          margin: 0 15px;
        }
      }
      .share-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 400px;
        height: 60px;
        font-size: 26px;
        color: #ffffff;
        background: #ff397e;
        border-radius: 31px;
        i {
          width: 30px;
          height: 30px;
          background: url('@/assets/images/share-service/icon-wechat-white.png')
            0 0/100% 100% no-repeat;
          margin-right: 16px;
        }
        &[disabled] {
          opacity: 0.5;
        }
      }
      .download-title {
        font-size: 26px;
        color: #ff397e;
        margin: 20px 0 12px;
      }
      .close-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 400px;
        height: 60px;
        font-size: 26px;
        color: #ffffff;
        background: #ff397e;
        border-radius: 31px;
        margin-top: 8px;
      }
    }
    .share-close {
      width: 58px;
      height: 58px;
      background: url('@/assets/images/share-service/icon-close.png') 0 0/100%
        100% no-repeat;
    }
  }
}
</style>
<style lang="scss">
html,
body {
  background: #f4f5fa;
}
</style>
