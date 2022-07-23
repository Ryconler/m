<template>
  <div class="minicard-generater">
    <div :style="!devPreview ? 'z-index: -9998' : ''" class="mask"></div>
    <div
      ref="minicardDom"
      :style="!devPreview ? 'z-index: -9999' : ''"
      class="minicard"
    >
      <img
        class="image"
        :src="imgUrl"
        @load="imageLoad()"
        @error="imageLoad(true)"
      />
      <div v-if="price != undefined && price >= 0" class="cover">
        <div class="price">
          <span class="type">&yen;</span>
          <span class="num pf-medium">{{ getYenPrice(price) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import html2canvas from 'html2canvas'
import { ref, toRefs, watch } from 'vue'
import { convertImageBase64ToFile, getYenPrice } from '../../utils'
import { uplodaImageCMS } from '../../api/common'

const props = defineProps({
  imgUrl: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: undefined
  },
  successCallback: {
    type: Function,
    default: () => {}
  },
  failCallback: {
    type: Function,
    default: () => {}
  },
  devPreview: {
    type: Boolean,
    default: false
  }
})

const { imgUrl, successCallback, failCallback, devPreview } = toRefs(props)

const imageLoaded = ref(false)

const imageLoad = (err?: boolean) => {
  err && console.log('image load error')
  imageLoaded.value = true
}

const minicardDom = ref()
watch([imageLoaded], () => {
  if (imageLoaded.value) {
    console.log('所有图片加载完成，开始生成base64', imgUrl.value.slice(-5))
    html2canvas(minicardDom.value, {
      useCORS: true,
      // 不加的话滚动后生成的图片上面会有空白
      scrollX: 0,
      scrollY: 0
    })
      .then(canvas => {
        console.log('canvas生成成功', imgUrl.value.slice(-5))
        const data = canvas.toDataURL()
        console.log('base64生成成功', imgUrl.value.slice(-5))
        const file = convertImageBase64ToFile(data)
        uplodaImageCMS(file).then(result => {
          console.log(result)
          successCallback.value(result.downloadUrl || '')
        })
      })
      .catch(e => {
        console.log('base64生成失败', imgUrl.value.slice(-5), e)
        failCallback.value(e)
      })
  }
})
</script>
<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f4f5fa;
}
.minicard {
  position: fixed;
  top: 0;
  left: 0;
  width: 630px;
  height: 504px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img {
    display: block;
  }
  .image {
    // 模拟html2canvas不支持的object-fit: cover;
    width: auto;
    height: 100%;
    max-width: none;
  }
  .cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url(@/assets/images/minicard/bg-cover.png) 0 0/100% 100%
      no-repeat;
    .price {
      position: absolute;
      bottom: 10px;
      left: 20px;
      color: #ffffff;
      .type {
        font-size: 40px;
      }
      .num {
        font-size: 80px;
      }
    }
  }
}
</style>
