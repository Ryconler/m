<template>
  <div v-if="spuMaterialDetail" class="material-list">
    <div v-if="spuMaterialDetail.sku_info" class="top">
      <div class="spu-detail">
        <BaseImg
          class="spu-image"
          :src="spuMaterialDetail.sku_info.main_pic"
          :width="168"
          :height="168"
        />
        <div class="spu-info">
          <p class="spu-name">
            {{ spuMaterialDetail.sku_info.name }}
          </p>
          <div class="spu-price">
            <span class="yen">&yen;</span>
            <span class="price">{{
              getYenPrice(spuMaterialDetail.sku_info.lowest_price)
            }}</span>
            <span
              v-if="
                spuMaterialDetail.sku_info.lowest_price <
                spuMaterialDetail.sku_info.highest_price
              "
              class="qi"
              >起</span
            >
          </div>
        </div>
      </div>
      <div
        v-if="
          spuMaterialDetail.material_info &&
          spuMaterialDetail.material_info.copy_writing
        "
        class="copy-content"
      >
        {{ spuMaterialDetail.material_info.copy_writing }}
        <button
          v-if="spuMaterialList.length == 0"
          class="share-button"
          @click="shareClick"
        >
          分享
        </button>
        <button class="copy-button" @click="copyClick">复制文案</button>
      </div>
    </div>
    <ul v-if="spuMaterialDetail.material_info" class="list">
      <!-- 图片素材 -->
      <li
        v-for="(item, index) in spuMaterialDetail.material_info.pic || []"
        :key="index"
        class="material"
      >
        <div class="material-valid-time">
          有效时间：<span class="pf-simbold"
            >{{ dayjs(item.start_time * 1000).format('YYYY.MM.DD') }} -
            {{ dayjs(item.end_time * 1000).format('YYYY.MM.DD') }}</span
          >
        </div>
        <div class="material-images">
          <BaseImg
            v-for="(item2, index2) in item.content"
            :key="index2"
            class="material-image"
            :src="item2.url"
            :width="200"
            :height="200"
            @click="mediaClick(index2, item.content, MaterialType.Image)"
          />
        </div>
        <div class="material-buttons">
          <button class="share-button" @click="shareClick"><i></i>分享</button>
          <button
            class="external-button"
            @click="externalClick(item.content, MaterialType.Image)"
          >
            <i></i>一键群发
          </button>
        </div>
      </li>
      <!-- 海报素材 -->
      <li
        v-for="(item, index) in spuMaterialDetail.material_info.poster || []"
        :key="index"
        class="material"
      >
        <div class="material-valid-time">
          有效时间：<span class="pf-simbold"
            >{{ dayjs(item.start_time * 1000).format('YYYY.MM.DD') }} -
            {{ dayjs(item.end_time * 1000).format('YYYY.MM.DD') }}</span
          >
        </div>
        <div class="material-images">
          <BaseImg
            v-for="(item2, index2) in item.content"
            :key="index2"
            class="material-image"
            :src="item2.url"
            :width="200"
            :height="200"
            @click="mediaClick(index2, item.content, MaterialType.Poster)"
          />
        </div>
        <div class="material-buttons">
          <button class="share-button" @click="shareClick"><i></i>分享</button>
          <button
            class="external-button"
            @click="externalClick(item.content, MaterialType.Poster)"
          >
            <i></i>一键群发
          </button>
        </div>
      </li>
      <!-- 视频素材 -->
      <li
        v-for="(item, index) in spuMaterialDetail.material_info.video || []"
        :key="index"
        class="material"
      >
        <div class="material-valid-time">
          有效时间：<span class="pf-simbold"
            >{{ dayjs(item.start_time * 1000).format('YYYY.MM.DD') }} -
            {{ dayjs(item.end_time * 1000).format('YYYY.MM.DD') }}</span
          >
        </div>
        <div class="material-videos">
          <video
            :src="item.content.url"
            :poster="item.content.cover"
            class="material-video"
            @click="mediaClick(0, item.content, MaterialType.Video)"
          ></video>
          <i class="video-play"></i>
          <span class="video-time">{{
            dayjs.duration(item.content.duration, 'seconds').format('mm:ss')
          }}</span>
        </div>
        <div class="material-tip">朋友圈内只能分享15秒以内的视频哦~</div>
        <div class="material-buttons">
          <button class="share-button" @click="shareClick"><i></i>分享</button>
          <button
            class="external-button"
            @click="externalClick(item.content, MaterialType.Video)"
          >
            <i></i>一键群发
          </button>
        </div>
      </li>
    </ul>
    <div class="menu_wkBox_back_box"></div>

    <MediasPreview
      ref="mediasPreview"
      v-model:show="workchatMediaShow"
      :spu-id="spuId"
      :medias="previewMedias"
      :initial="workchatMediaInitial"
      :copy-text="spuMaterialDetail.material_info?.copy_writing"
    >
    </MediasPreview>
    <MediasExternal
      ref="mediasExternal"
      :spu-id="spuId"
      :medias="previewMedias"
      :share-text="spuMaterialDetail.material_info?.copy_writing"
    >
    </MediasExternal>
  </div>
</template>
<script lang="ts" setup>
import {
  copyTextClipboard,
  setLoading,
  sleep,
  getYenPrice,
  ensureLogin
} from '@/utils'
import { computed, nextTick, onMounted, Ref, ref } from 'vue'
import { Toast } from 'vant'
import { useRoute } from 'vue-router'
import {
  MaterialType,
  ShareMaterialType,
  ShareSpuType,
  SpuMaterialType
} from '@/constant/shareService'
import { querySpuMaterial } from '@/api/shareService'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import {
  useSpuInfo,
  useSpuShare
} from '@/composables/share-service/shareServiceEarnSpu'
import MediasPreview from '../components/MediasPreview.vue'
import MediasExternal from '../components/MediasExternal.vue'

dayjs.extend(customParseFormat)
dayjs.extend(duration)

ensureLogin()

setLoading(true)

const route = useRoute()

const spuMaterialDetail: Ref<SpuMaterialType | null> = ref(null)
const spuMaterialList = computed(() => {
  if (spuMaterialDetail.value && spuMaterialDetail.value.material_info) {
    return [
      ...(spuMaterialDetail.value.material_info.pic || []),
      ...(spuMaterialDetail.value.material_info.poster || []),
      ...(spuMaterialDetail.value.material_info.video || [])
    ]
  }
  return []
})

const spuInfo: Ref<ShareSpuType> = ref({})
const spuId = ref(Number(route.params.spuId))
const templateType2Id = ref(Number(route.query.templateType2Id))
const skuId = ref(route.query.skuId ? Number(route.query.skuId) : undefined)
const shareCityCode = ref(<string>route.query.shareCityCode)

const workchatMediaShow = ref(false)
const workchatMediaInitial = ref(0)
const mediasPreview = ref()
const mediasExternal = ref()
const previewMedias: Ref<ShareMaterialType[]> = ref([])

function initPreviewMedias(
  content: { url: string }[] | { url: string },
  type: MaterialType
) {
  previewMedias.value = Array.isArray(content)
    ? content.map(item => ({
        materialType: type,
        picUrl: item.url,
        shareLink: spuLink.value
      }))
    : [
        {
          materialType: type,
          picUrl: content.url,
          shareLink: spuLink.value
        }
      ]
}

onMounted(async () => {
  spuMaterialDetail.value = await querySpuMaterial(spuId.value, skuId.value)
  spuInfo.value = {
    businessId: templateType2Id.value == 601 ? spuId.value : undefined,
    spuId: templateType2Id.value == 601 ? skuId.value : spuId.value,
    templateType2Id: templateType2Id.value,
    spuName: spuMaterialDetail.value.sku_info?.name,
    cmmdtyImage: spuMaterialDetail.value.sku_info?.main_pic,
    minPrice: spuMaterialDetail.value.sku_info?.lowest_price
  }
  setLoading(false)
})

const copyClick = async () => {
  const res = await copyTextClipboard(
    spuMaterialDetail.value?.material_info?.copy_writing
  )
  if (res) {
    Toast('复制成功')
  } else {
    Toast('复制失败')
  }
}

const mediaClick = (
  index: number,
  content: { url: string }[] | { url: string },
  type: MaterialType
) => {
  initPreviewMedias(content, type)
  workchatMediaShow.value = true
  workchatMediaInitial.value = index
}

const { spuLink } = useSpuInfo(spuInfo, spuId)
const { spuShareClick } = useSpuShare(spuInfo, spuId, shareCityCode)
const shareClick = async (e: Event) => {
  if (spuMaterialDetail.value?.material_info?.copy_writing) {
    const res = await copyTextClipboard(
      spuMaterialDetail.value.material_info.copy_writing
    )
    if (res) {
      Toast({
        message: '复制分享文案成功，可粘贴\n至输入框内发送～',
        duration: 0
      })
      await sleep(1000)
    }
  }
  spuShareClick(e)
}

const externalClick = async (
  content: { url: string }[] | { url: string },
  type: MaterialType
) => {
  initPreviewMedias(content, type)
  await nextTick()
  mediasExternal.value.shareToExternal()
}
</script>

<style lang="scss" scoped>
.material-list {
  padding: 24px 32px;
  .top {
    background: #ffffff;
    border-radius: 12px;
    padding: 0 24px;
    margin-bottom: 24px;
    .spu-detail {
      display: flex;
      padding: 24px 0;
      .spu-image {
        overflow: hidden;
        border-radius: 8px;
        flex: none;
        margin-right: 24px;
      }
      .spu-info {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .spu-name {
          font-size: 28px;
          color: #121212;
          line-height: 40px;
          @include ellicpsisN(2);
        }
        .spu-price {
          display: flex;
          color: #ff397e;
          align-items: flex-end;
          .yen,
          .qi {
            font-size: 24px;
            line-height: 30px;
            padding-bottom: 4px;
          }
          .price {
            font-size: 34px;
            line-height: 44px;
            margin: 0 4px;
          }
        }
      }
    }
    .copy-content {
      position: relative;
      word-break: break-all;
      white-space: pre-wrap;
      padding: 24px 136px 33px 0;
      border-top: 1px solid #eeeeee;
      color: #15161f;
      line-height: 38px;
      font-size: 26px;
      .share-button {
        position: absolute;
        top: 24px;
        right: 0;
        color: #ff397e;
        line-height: 38px;
        font-size: 26px;
      }
      .copy-button {
        position: absolute;
        bottom: 33px;
        right: 0;
        color: #ff397e;
        line-height: 38px;
        font-size: 26px;
      }
    }
  }
  .list {
    .material {
      background: #ffffff;
      border-radius: 12px;
      padding: 0 24px 32px;
      margin-bottom: 24px;
      .material-valid-time {
        line-height: 78px;
        font-size: 24px;
        color: #999999;
        span {
          color: #121212;
        }
      }
      .material-images {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 32px;
        .material-image {
          overflow: hidden;
          border-radius: 8px;
          margin-right: 19px;
          margin-bottom: 16px;
          &:nth-child(3n) {
            margin-right: 0;
          }
          &:nth-last-child(1),
          &:nth-last-child(2),
          &:nth-last-child(3) {
            margin-bottom: 0;
          }
        }
      }
      .material-videos {
        position: relative;
        margin-bottom: 24px;
        .material-video {
          width: 638px;
          height: 280px;
          border-radius: 8px;
        }
        .video-play {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 68px;
          height: 68px;
          background: url('@/assets/images/share-service/icon-video_play.png') 0
            0/100% 100% no-repeat;
        }
        .video-time {
          position: absolute;
          right: 18px;
          bottom: 18px;
          width: 84px;
          height: 30px;
          background: rgba(0, 0, 0, 0.24);
          border-radius: 16px;
          color: #ffffff;
          line-height: 30px;
          font-size: 22px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .material-tip {
        margin-bottom: 24px;
        color: #999999;
        line-height: 36px;
        font-size: 24px;
        padding-left: 44px;
        background: url('@/assets/images/share-service/icon-tip.png') left
          center/32px 32px no-repeat;
      }
      .material-buttons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        button:not(:last-child) {
          margin-right: 24px;
        }

        .share-button {
          width: 180px;
          height: 56px;
          background: #ff397e;
          border-radius: 28px;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          line-height: 30px;
          i {
            width: 28px;
            height: 28px;
            background: url('@/assets/images/share-service/icon-share.png') 0 0/100%
              100% no-repeat;
            margin-right: 8px;
          }
        }
        .external-button {
          width: 180px;
          height: 56px;
          background: #ff397e;
          border-radius: 28px;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          line-height: 30px;
          i {
            width: 28px;
            height: 28px;
            background: url('@/assets/images/share-service/icon-wechat-white.png')
              0 0/100% 100% no-repeat;
            margin-right: 8px;
          }
        }
      }
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
