import { ImageType } from '@/constant/fullscreenPreview'
import {
  Page1ContentThemeType,
  Page1ContentType,
  Page1MinElementType
} from '@/constant/page1'
import { computed, nextTick, Ref, ref, toRefs, watch, watchEffect } from 'vue'
import { getMinElement } from '@/api/page1'

export const getTabs = (props: any) => {
  const { tabs } = toRefs(props)
  const selectedTab = ref(0) //所选tab
  const showTabs: Ref<Page1ContentType[]> = computed(() => {
    return tabs.value.filter((item: Page1ContentType) => {
      if (item.elementInfo && item.elementInfo.length > 0) {
        return true
      } else {
        return false
      }
    })
  })
  return { selectedTab, showTabs }
}

export const getThemeDetail = () => {
  /* 在每张图片上创建图片详情 */
  function refreshImageDetail() {
    nextTick(() => {
      const swipeDoms = document.querySelectorAll(
        '#image-preview .van-swipe-item'
      )
      swipeDoms.forEach((item: Element, index: number) => {
        const detailDomText = selectedThemeImages.value[index].detailDomText
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
  /* 删除旧的图片详情DOM */
  function deleteImageDetail() {
    const doms = document.querySelectorAll('#image-preview  .image-detail')
    doms.forEach((item: Element) => {
      item.remove()
    })
  }

  const selectedTheme: Ref<Page1ContentThemeType | null> = ref(null) //所选主题
  const selectedThemeImages: Ref<ImageType[]> = computed(() => {
    const theme = selectedTheme.value
    if (theme && theme.images) {
      return theme.images.map((item) => {
        return {
          imgUrl: item,
          detailDomText: `<div class="theme-title pf-medium">${theme.name}</div>` //每张图片上面需要显示的图片详情
        }
      })
    } else {
      return []
    }
  }) //所选主题图片
  const selectedThemeImageStart = ref(0) //所选主题图片索引
  const themeDetailShow = ref(false) //是否显示主题详情
  watch(themeDetailShow, () => {
    if (themeDetailShow.value) {
      setTimeout(() => {
        refreshImageDetail()
      }, 200)
    } else {
      deleteImageDetail()
    }
  })
  const themeDetailImages = computed(() => {
    return selectedThemeImages.value.map((item) => item.imgUrl)
  })
  const themeDetailImageIndex = ref(0)
  const themeDetailImageChange = (index: number) => {
    themeDetailImageIndex.value = index
    refreshImageDetail()
  }
  const showThemeDetail = (theme: Page1ContentThemeType, picIndex: number) => {
    selectedTheme.value = theme
    selectedThemeImageStart.value = picIndex
    themeDetailImageIndex.value = picIndex
    themeDetailShow.value = true
  }
  const themeDetailElement: Ref<Page1MinElementType | null> = ref(null)
  watchEffect(async () => {
    const id = selectedTheme.value && selectedTheme.value.id
    if (id) {
      themeDetailElement.value = await getMinElement(id)
    }
  })
  return {
    selectedThemeImageStart,
    themeDetailShow,
    themeDetailImages,
    showThemeDetail,
    themeDetailImageIndex,
    themeDetailImageChange,
    themeDetailElement
  }
}
