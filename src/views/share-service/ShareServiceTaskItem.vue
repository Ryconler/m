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
        <div class="task-link">
          <a v-if="task.detailLink" :href="taskLink" @click="linkClick"
            >查看链接</a
          >
          <div v-else></div>
        </div>
        <div class="task-buttons">
          <div class="task-quick-button" @click="quickClick"><i></i>分享</div>
          <div class="workchat-send-button" @click="externalClick">
            <i></i>一键群发
          </div>
          <div class="task-share-button" @click="shareClick"><i></i>分享</div>
        </div>
      </div>
    </div>

    <MediasPreview
      ref="mediasPreview"
      v-model:show="workchatMediaShow"
      :task-id="task.id"
      :medias="task.shareMaterialList"
      :initial="workchatMediaInitial"
      :copy-text="task.shareArticle"
    >
    </MediasPreview>
    <MediasExternal
      ref="mediasExternal"
      :task-id="task.id"
      :medias="task.shareMaterialList"
      :share-text="task.shareArticle"
    >
    </MediasExternal>
  </div>
</template>
<script lang="ts" setup>
import { computed, PropType, ref, toRefs } from 'vue'
import {
  MaterialType,
  ShareTaskBusinessType,
  ShareTaskType,
  TrackTerm
} from '@/constant/shareService'
import MediasPreview from './components/MediasPreview.vue'
import MediasExternal from './components/MediasExternal.vue'
import qs from 'query-string'
import LogoYunchan from '@/assets/images/share-service/logo-yunchan.png'
import LogoChengzhangjia from '@/assets/images/share-service/logo-chengzhangjia.png'
import LogoZiying from '@/assets/images/share-service/logo-ziying.png'
import LogoBaoxian from '@/assets/images/share-service/logo-baoxian.png'
import LogoHuodong from '@/assets/images/share-service/logo-huodong.png'
import { videoPreview } from '@/utils'
import { ImagePreview as VanImagePreview } from 'vant'
import { get } from 'lodash'
import { DefaultCity } from '@/constant/city'

const props = defineProps({
  cityId: {
    type: [String, Number],
    default() {
      return DefaultCity.cityId
    }
  },
  task: {
    type: Object as PropType<ShareTaskType>,
    default() {
      return {}
    }
  },
  slices: {
    type: Number,
    default: undefined
  }
})

const { cityId, task } = toRefs(props)

const workchatMediaShow = ref(false)
const workchatMediaInitial = ref(0)

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

const linkClick = () => {}

const mediasPreview = ref()
const mediasExternal = ref()

const quickClick = async () => {
  mediasPreview.value.quickShare()
}

const externalClick = async () => {
  mediasExternal.value.shareToExternal()
}

const shareClick = () => {
  location.href = `/v2/share-service/task/${task.value.id}?cityId=${cityId.value}&kwtarget=blank`
}

const imageClick = (originIndex: number) => {
  workchatMediaShow.value = true
  workchatMediaInitial.value = originIndex
}

const videoClick = (index: number) => {
  workchatMediaShow.value = true
  workchatMediaInitial.value = index
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
      flex-wrap: wrap;
      .task-link {
        flex: none;
        a {
          display: block;
          font-size: 24px;
          color: #ff397e;
          padding-right: 32px;
          background: url('@/assets/images/share-service/icon-link.png') right
            center/24px 24px no-repeat;
        }
      }
      .task-buttons {
        display: flex;
        align-items: center;
        .workchat-send-button {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 20px;
          height: 48px;
          background: #ff397e;
          border-radius: 24px;
          font-size: 24px;
          line-height: 30px;
          color: #ffffff;
          i {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            background: url('@/assets/images/share-service/icon-wechat-white.png')
              0 0/100% 100% no-repeat;
          }
        }
        .task-quick-button {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 20px;
          height: 48px;
          background: #ff397e;
          border-radius: 24px;
          font-size: 24px;
          line-height: 30px;
          color: #ffffff;
          margin-right: 10px;
          i {
            width: 30px;
            height: 30px;
            background: url('@/assets/images/share-service/icon-share.png') 0 0/100%
              100% no-repeat;
            margin-right: 10px;
          }
        }
        .task-share-button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 180px;
          height: 56px;
          background: #ff397e;
          border-radius: 28px;
          font-size: 24px;
          line-height: 30px;
          color: #ffffff;
          i {
            width: 28px;
            height: 28px;
            background: url('@/assets/images/share-service/icon-share.png') 0 0/100%
              100% no-repeat;
            margin-right: 8px;
          }
        }
      }
    }
  }
}
</style>
