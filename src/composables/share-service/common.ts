import { rem2RealPx } from '@/utils'
import { computed } from 'vue'

export const useOffsetTop = () => {
  const classifySortOffsetTop = computed(() => {
    const tabHeight = rem2RealPx(84 / 75)
    return tabHeight
  })

  const classifySortStickyDistance = computed(() => {
    const taskDom = document.querySelector('.share-service-task-comp')
    const bannerDom = document.querySelector('.share-service-banner')
    const titleBarDom = document.querySelector('.title-bar')
    const taskHeight = taskDom ? taskDom.getBoundingClientRect().height : 0
    const bannerHeight = bannerDom
      ? bannerDom.getBoundingClientRect().height
      : 0
    const titleBarHeight = titleBarDom
      ? titleBarDom.getBoundingClientRect().height
      : 0
    return taskHeight + bannerHeight + titleBarHeight
  })
  return { classifySortOffsetTop, classifySortStickyDistance }
}
