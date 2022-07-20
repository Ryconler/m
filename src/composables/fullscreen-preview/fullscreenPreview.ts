import { computed, nextTick, onMounted, Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { localStore } from '@/utils'
import { ImageType } from '@/constant/fullscreenPreview'
import { toNumber } from 'lodash'
import { StorageKeys } from '@/constant/storage'

export const useShow = () => {
  const isShow = ref(false) //是否显示
  onMounted(() => {
    isShow.value = true
  })
  return { isShow }
}

export const useImages = () => {
  /* 在每张图片上创建图片详情 */
  function refreshImageDetail() {
    nextTick(() => {
      const swipeDoms = document.querySelectorAll(
        '#image-preview .van-swipe-item'
      )
      swipeDoms.forEach((item: Element, index: number) => {
        const detailDomText = imageList.value[index].detailDomText
        const imageDom = item.querySelector('.van-image-preview__image')
        const exist = imageDom && imageDom.querySelector('.image-detail')
        if (detailDomText && imageDom && !exist) {
          try {
            const detailDom = new DOMParser().parseFromString(
              detailDomText,
              'text/html'
            ).body.childNodes[0]
            const imageDetail = document.createElement('div')
            imageDetail.className = 'image-detail'
            imageDetail.appendChild(detailDom)
            imageDom.appendChild(imageDetail)
          } catch (e) {
            console.error('添加图片详情失败', e)
          }
        }
      })
    })
  }

  const imageList: Ref<ImageType[]> = ref([]) //图片列表
  const imagesInStorage = localStore.getItem(StorageKeys.PreviewImages) || []
  imageList.value = imagesInStorage
  const images = computed(() => {
    return imageList.value.map(item => item.imgUrl)
  }) //显示图片
  setTimeout(() => {
    refreshImageDetail()
  }, 200)

  const startPosition = ref(0) //图片初始索引
  const route = useRoute()
  const imageStartInRoute = route.query.start ? toNumber(route.query.start) : 0
  startPosition.value = imageStartInRoute

  const imageIndex = ref(0) //图片当前索引
  imageIndex.value = imageStartInRoute

  const imageChange = (index: number) => {
    imageIndex.value = index
    refreshImageDetail()
  }
  return { imageList, images, startPosition, imageIndex, imageChange }
}
