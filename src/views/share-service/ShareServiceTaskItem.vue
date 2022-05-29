<template>
  <div class="share-task-item">
    <img class="task-logo" :src="taskLogo" />
    <div class="task-detail">
      <div v-if="task.title" class="task-title pf-medium">{{ task.title }}</div>
      <div v-if="task.sharePeople" class="task-tags">
        <div
          v-for="(item, index) in task.sharePeople.split(',')"
          :key="index"
          class="task-tag"
        >
          {{ item }}
        </div>
      </div>
      <div v-if="task.endTime" class="task-time">
        活动截止日期：{{ task.endTime }}
      </div>
      <div v-if="task.shareArticle" class="task-text">
        {{ task.shareArticle }}
      </div>
      <div v-if="task.shareMaterialList" class="task-materials">
        <div
          v-for="(item, index) in task.shareMaterialList.slice(0, slices)"
          :key="index"
          class="task-material"
        >
          <div
            v-if="item.materialType == MaterialType.Video"
            class="task-video"
            @click="videoClick(index)"
          >
            <video :src="`${item.picUrl}\#t=0.1`" preload="metadata"></video>
            <i class="play-icon"></i>
          </div>
          <BaseImg
            v-else
            :src="item.picUrl"
            :width="160"
            :height="160"
            @click="imageClick(index)"
          >
          </BaseImg>
        </div>
      </div>
      <div class="task-functions">
        <a v-if="task.detailLink" class="task-link" :href="taskLink"
          >查看链接</a
        >
        <div v-else></div>
        <div v-if="isWorkChat" class="task-moment" @click="momentClick">
          <i></i>企微朋友圈
        </div>
        <div v-else class="task-share" @click="shareClick"><i></i>分享</div>
      </div>
    </div>

    <MediaPreview
      v-if="isWorkChat && workchatMediaShow"
      v-model:show="workchatMediaShow"
      :medias="task.shareMaterialList"
      :initial="workchatMediaInitial"
      :copy-text="task.shareArticle"
    >
    </MediaPreview>
    <VideoPlayer
      v-else-if="videoPlayerShow"
      v-model:show="videoPlayerShow"
      :video-url="videoPlayerUrl"
    ></VideoPlayer>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType, ref, toRefs } from 'vue'
import { MaterialType, ShareTaskBusinessType } from '@/constant/shareService'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import qs from 'query-string'
import LogoYunchan from '@/assets/images/share-service/logo-yunchan.png'
import LogoChengzhangjia from '@/assets/images/share-service/logo-chengzhangjia.png'
import LogoZiying from '@/assets/images/share-service/logo-ziying.png'
import LogoBaoxian from '@/assets/images/share-service/logo-baoxian.png'
import LogoHuodong from '@/assets/images/share-service/logo-huodong.png'
import { convertImageBase64ToFile } from '@/utils'
import { Toast, ImagePreview as VanImagePreview } from 'vant'
import { get } from 'lodash'

const props = defineProps({
  task: {
    type: Object as PropType<any>,
    default() {
      return {}
    }
  },
  slices: {
    type: Number,
    default: undefined
  }
})

const { task } = toRefs(props)
const router = useRouter()
const store = useStore()

const isWorkChat = ref(false)
const workchatMediaShow = ref(false)
const workchatMediaInitial = ref(0)
const videoPlayerShow = ref(false)
const videoPlayerUrl = ref('')

const taskLogo = computed(() => {
  switch (task.value.businessType) {
    case ShareTaskBusinessType.Yunchan:
      return LogoYunchan
    case ShareTaskBusinessType.Chengzhangjia:
      return LogoChengzhangjia
    case ShareTaskBusinessType.Ziying:
      return LogoZiying
    case ShareTaskBusinessType.Baoxian:
      return LogoBaoxian
    case ShareTaskBusinessType.Huodong:
      return LogoHuodong
    default:
      return LogoYunchan
  }
})

const taskLink = computed(() => {
  if (task.value.detailLink) {
    const linkObj = qs.parseUrl(task.value.detailLink)
    linkObj.query.kwtarget = 'blank'
    return qs.stringifyUrl(linkObj)
  } else {
    return 'javascript:;'
  }
})

const momentClick = async () => {
  if (task.value.shareMaterialList) {
    Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '正在生成带员工信息图片素材中，请稍等...'
    })
    const videoUrls = []
    const imgUrls: string[] = []
    const imgMediaIds: string[] = []
    const imgMediaIdPromises = []
    for (const material of task.value.shareMaterialList) {
      if (material.materialType == MaterialType.Video) {
        videoUrls.push(material.picUrl)
      } else if (
        material.materialType == MaterialType.BxPoster ||
        material.materialType == MaterialType.Poster
      ) {
        imgMediaIdPromises.push(
          new Promise(resolve => {
            imgUrls.push(material.picUrl)
            resolve('success')
          })
        )
      } else if (material.materialType == MaterialType.Image) {
        imgUrls.push(material.picUrl)
      }
    }
    Promise.all(imgMediaIdPromises).then(() => {
      Toast('分享成功')
    })
  }
}

const shareClick = () => {
  router.push({
    name: 'shareServiceTaskDetail',
    params: {
      taskId: task.value.id
    }
  })
}

const imageClick = (originIndex: number) => {
  if (isWorkChat.value) {
    workchatMediaShow.value = true
    workchatMediaInitial.value = originIndex
    return
  }
  let beforeVideoNum = 0 //点击图片之前视频的数量
  const imgUrls =
    task.value && task.value.shareMaterialList
      ? task.value.shareMaterialList
          .filter((item: any, index: number) => {
            if (item.materialType == MaterialType.Video) {
              index < originIndex && beforeVideoNum++
              return false
            } else {
              return true
            }
          })
          .map((item: any) => item.picUrl)
      : []
  VanImagePreview({
    images: imgUrls,
    startPosition: originIndex - beforeVideoNum
  })
}

const videoClick = (index: number) => {
  if (isWorkChat.value) {
    workchatMediaShow.value = true
    workchatMediaInitial.value = index
    return
  }
  videoPlayerShow.value = true
  videoPlayerUrl.value = get(
    task.value,
    `shareMaterialList[${index}].picUrl`,
    ''
  )
}
</script>

<style lang="scss" scoped>
.share-task-item {
  display: flex;
  padding: 24px 24px 32px 24px;
  background: #ffffff;
  border-radius: 16px;
  .task-logo {
    flex: none;
    margin-right: 24px;
    width: 80px;
    height: 80px;
  }
  .task-detail {
    flex: 1;
    .task-title {
      font-size: 28px;
      color: #15161f;
      line-height: 34px;
      margin-bottom: 12px;
    }
    .task-tags {
      display: flex;
      flex-wrap: wrap;
      .task-tag {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        color: #333333;
        height: 24px;
        padding: 0 8px;
        background: #eeeeee;
        border-radius: 4px;
        margin-right: 12px;
        margin-bottom: 12px;
      }
    }
    .task-time {
      font-size: 24px;
      color: #999999;
      line-height: 30px;
      margin-bottom: 10px;
    }
    .task-text {
      font-size: 24px;
      color: #15161f;
      line-height: 30px;
      word-break: break-all;
      white-space: pre-wrap;
      margin-bottom: 12px;
    }
    .task-materials {
      display: flex;
      flex-wrap: wrap;
      .task-material {
        width: 160px;
        height: 160px;
        margin-right: 24px;
        margin-bottom: 20px;
        border-radius: 8px;
        overflow: hidden;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .task-video {
          position: relative;
          width: 100%;
          height: 100%;
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
            width: 48px;
            height: 48px;
            background: url('@/assets/images/share-service/icon-play.png') 0 0/100%
              100% no-repeat;
          }
        }
      }
    }
    .task-functions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .task-link {
        font-size: 24px;
        color: #ff397e;
        padding-right: 32px;
        background: url('@/assets/images/share-service/icon-link.png') right
          center/24px 24px no-repeat;
      }
      .task-moment {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 48px;
        background: #ff397e;
        border-radius: 24px;
        font-size: 24px;
        color: #ffffff;
        i {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          background: url('@/assets/images/share-service/icon-moment-white.png')
            0 0/100% 100% no-repeat;
        }
      }
      .task-share {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 160px;
        height: 48px;
        background: #ff397e;
        border-radius: 24px;
        font-size: 24px;
        color: #ffffff;
        i {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          background: url('@/assets/images/share-service/icon-wechat-white.png')
            0 0/100% 100% no-repeat;
        }
      }
    }
  }
}
</style>
