import { computed, nextTick, Ref, ref, watch } from 'vue'
import { getMinPriceSpu } from '@/api/photography'
import { getProductUrl } from './photographyTabsContent'
import {
  PhotoContentThemeType,
  PhotoMinProductType
} from '@/constant/photography'

export function getProductInfo(theme: Ref<PhotoContentThemeType>) {
  const productInfo: Ref<PhotoMinProductType> = ref({})
  const productUrl = ref('')
  watch(
    () => theme.value.themeId,
    async () => {
      productInfo.value = await getMinPriceSpu(theme.value.themeId)
      productUrl.value = getProductUrl(productInfo.value)
      createThemeDetailInfo(theme)
    }
  )
  return { productInfo, productUrl }
}

export function getThemePics(theme: Ref<PhotoContentThemeType>) {
  return computed(() => {
    return theme.value.themePics || []
  })
}

export function getImageChange(imageIndex: Ref<number>) {
  return (newIndex: number) => {
    createThemeDetailInfo()
    imageIndex.value = newIndex
  }
}

/* 在每张图片上创建用于显示主题信息的DOM */
let eleThemeDetailInfo: ChildNode
async function createThemeDetailInfo(newTheme?: Ref<PhotoContentThemeType>) {
  await nextTick()
  if (newTheme) {
    // 创建新主题信息DOM
    const strThemeDetailInfo = `
    <div class="app-theme-detail-info">
      <div class="theme-detail-info">
        <div class="title pf-medium">${newTheme.value.themeName}</div>
        ${
          newTheme.value.themeStyles &&
          newTheme.value.themeStyles.map((item: string) => {
            return `<div class="style">#${item}</div>`
          })
        }
      </div>
    </div>`
    eleThemeDetailInfo = new DOMParser().parseFromString(
      strThemeDetailInfo,
      'text/html'
    ).body.childNodes[0]
    // 删除旧的主题信息的DOM
    document
      .querySelectorAll('#theme-detail .app-theme-detail-info')
      .forEach((ele: Element) => {
        ele.remove()
      })
  }
  document
    .querySelectorAll('#theme-detail .van-image-preview__image')
    .forEach((ele: Element) => {
      const exist = ele.querySelector('.app-theme-detail-info')
      // 图片上面没有主题信息DOM则添加
      if (!exist) {
        const newEleThemeDetailInfo = eleThemeDetailInfo.cloneNode(true)
        ele.appendChild(newEleThemeDetailInfo)
      }
    })
}
