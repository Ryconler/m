import { checkElement, uncheckElement } from '@/api/elementItem'
import { ElementItemType } from '@/constant/elementItem'
import { ensureLogin } from '@/utils'
import { isEmpty } from 'lodash'
import { Toast } from 'vant'
import { computed, ref, Ref } from 'vue'

export const getElementCheck = (emit: any, elementId: number) => {
  const elementAddClick = async () => {
    // await ensureLogin()
    const result = await checkElement(elementId)
    if (result == '1') {
      emit('add-success')
    } else if (result == '3') {
      emit('add-exist')
    } else {
      emit('add-fail')
    }
  }

  const elementDelClick = async () => {
    await ensureLogin()
    const result = await uncheckElement(elementId)
    if (result == '1') {
      emit('del-success')
    } else {
      emit('del-fail')
    }
  }
  return { elementAddClick, elementDelClick }
}

export const getElementShare = (element: Ref<ElementItemType>) => {
  const elementShareStatus = computed(() => {
    let env = false
    if (import.meta.env.DEV) {
      env = true
    }
    return env && elementShareShow.value && !isEmpty(element.value)
  })
  const elementShareInfo = computed(() => {
    return {
      url: element.value.link,
      title: element.value.title,
      desc: element.value.title,
      poster: element.value.image
    }
  })
  const elementShareShow = ref(false)
  const elementShareImgtxt = ref('')
  const openShare = () => {}
  const elementShareLoad = (base64: string) => {
    elementShareImgtxt.value = base64
    // 生成自定义图文成功，使用自定义图文分享
    if (elementShareShow.value) {
      elementShareShow.value = false
      Toast.clear()
      openShare()
    }
  }
  const elementShareClick = () => {
    if (elementShareImgtxt.value) {
      // 生成过自定义图文，直接拉起分享
      openShare()
    } else {
      elementShareShow.value = true
      Toast.loading({
        forbidClick: true,
        duration: 0
      })
      setTimeout(() => {
        // 生成自定义图文失败或超时，使用原生图文分享
        if (elementShareShow.value) {
          elementShareShow.value = false
          Toast.clear()
          openShare()
        }
      }, 10 * 1000)
    }
  }
  return {
    elementShareStatus,
    elementShareInfo,
    elementShareLoad,
    elementShareClick
  }
}
