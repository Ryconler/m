import jsCookie from 'js-cookie'
import { divide, isEmpty, isString, round, toNumber } from 'lodash'
import Clipboard from 'clipboard'
import {
  createApp,
  createVNode,
  getCurrentInstance,
  mergeProps,
  reactive
} from 'vue'
import VideoPlayer from '@/components/video-player/VideoPlayer.vue'
import Minicard from '@/components/minicard/Minicard.vue'
import urlPrefixes from '@/constant/urlPrefixes'
import kwimage from './kwimage'
import queryString from 'query-string'
import { geQrcode } from '@/api/common'

export function setLoading(isShow = true) {
  const loadDom: HTMLElement | null = document.querySelector(
    '#loadingComponent'
  ) as HTMLElement
  if (loadDom) {
    if (isShow) {
      loadDom.style.display = 'flex'
    } else {
      loadDom.style.display = 'none'
    }
  }
}

export function ensureLogin(url?: string) {
  const uid = jsCookie.get('uid')
  const skey = jsCookie.get('skey')
  if (uid && skey) {
    return {
      uid,
      skey
    }
  }
  const referUrl = url || location.href
  location.href = `/login?referer=${encodeURIComponent(referUrl)}`
  throw {}
}

export function getDistanceKm(m: number) {
  if (m <= 100) {
    return '0.1'
  } else {
    const km = round(m / 1000, 1).toString()
    if (km.split('.').length == 1) {
      return `${km}.0`
    } else {
      return `${km}`
    }
  }
}
export function getImageBase64(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = function () {
      canvas.width = img.width
      canvas.height = img.height
      ctx && ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png', 1.0))
    }
    img.onerror = function () {
      reject('load error')
    }
  })
}

export function toDemotion(value: string | number, rate = 100) {
  let num = toNumber(value)
  num = isNaN(num) ? 0 : num
  return round(divide(num, rate), 2)
}

export function getYenPrice(price: string | number) {
  let integer = ''
  let decimal = ''
  const p = toDemotion(price).toString()
  const result = p.split('.')
  if (result.length === 2) {
    integer = result[0]
    if (parseInt(result[1]) > 0) {
      decimal = result[1]
    }
  } else {
    if (price >= 0) {
      integer = p
    }
  }
  let value = `${integer}`
  if (!isEmpty(decimal)) {
    value += `.${decimal}`
  }
  return value
}

/* ??????????????????????????? "{\"minShareAmount\":0,\"maxShareAmount\":30}" */
export function getShareAmount(spu: any) {
  const ratio = spu.ratio
  let minAmount = 0
  let maxAmount = 0
  try {
    if (isString(ratio)) {
      const shareAmount = JSON.parse(ratio) || {}
      minAmount = shareAmount.minShareAmount || 0
      maxAmount = shareAmount.maxShareAmount || 0
    }
  } catch (error) {
    // continue regardless of error
  }
  return {
    minAmount,
    maxAmount
  }
}

/* rem?????????????????????????????? */
export function rem2RealPx(rem: number) {
  return rem * parseFloat(document.documentElement.style.fontSize)
}

/* ???????????????????????? */
export async function copyTextClipboard(text = '') {
  return new Promise(resolve => {
    const button = document.createElement('button')
    button.setAttribute('data-clipboard-text', text)
    const clipboard = new Clipboard(button)
    clipboard.on('success', (e: ClipboardJS.Event) => {
      resolve(true)
      e.clearSelection()
    })
    clipboard.on('error', e => {
      console.error(e)
      resolve(false)
    })
    button.click()
  })
}

export function convertImageBase64ToApp(str = '') {
  return str.replace(/^data:image\/(jpeg|png|gif);base64,/, '')
}

export function convertImageBase64ToFile(str = '', fileName = 'tmpFile.png') {
  const arr = str.split(',')
  const mime = arr[0].match(/:(.*?);/) // ??????????????????????????????
  const type = (mime && mime[1]) || '' // ??????????????????????????????
  const bstr = atob(arr[1]) // ?????????base64??????
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
  return new File([u8arr], fileName, { type })
}

/* url????????????*/
export function replaceUrlKey(url: string, key: string, value: string) {
  const urlObj = queryString.parseUrl(url)
  urlObj.query[key] = value
  return queryString.stringifyUrl(urlObj)
}

/* ??????cookie????????????????????????????????????  */
export function replaceStrCookie(str: string, sign = '#') {
  // ?????????????????????#??????????????????#?????????
  // ???1: "https://life.cekid.com/v/product/123?entityId=#nodeCode#&uid=#uid#&kwtarget=blank"
  //  =>  "https://life.cekid.com/v/product/123?entityId=8002&uid=1300000139&kwtarget=blank"
  // ???2: "https://life.cekid.com/v/product/123?entityId=#nodeCode#&uid=#uid##id-1"
  //  =>  "https://life.cekid.com/v/product/123?entityId=8002&uid=1300000139#id-1"
  const strSplits = str.split(sign)
  let result = ''
  strSplits.forEach((item, index) => {
    // split??????????????????????????????????????????????????????
    if (index % 2 == 0) {
      result += item
    } else if (index < strSplits.length - 1) {
      result += (item && jsCookie.get(item)) || ''
    } else {
      result += sign + item
    }
  })
  return result
}

/* ??????????????????????????? */
export async function getPosterBase64(
  bgimg: string,
  shareLink = '',
  hserecomkey = ''
): Promise<string> {
  let qrcodeResource = ''
  const storeCode =
    jsCookie.get('storeCodeH5') || jsCookie.get('nodeCode') || ''
  shareLink = shareLink.replace(/#storeCode#/g, storeCode)
  const minicode = await geQrcode(shareLink, hserecomkey)
  qrcodeResource = `data:image/png;base64,${minicode}`
  try {
    const resultImage = await kwimage.composeImage({
      blankAreaImage: qrcodeResource,
      resourceImage: bgimg,
      format: 'image/jpeg',
      quality: '0.8'
    })
    return resultImage as string
  } catch (e) {
    console.error(e)
    // ???????????????????????????????????????????????????
    throw e
  }
}

/* ??????????????????????????? */
export async function getMinicardUrl(
  imgUrl: string,
  price?: number
): Promise<string> {
  return new Promise(resolve => {
    const devPreview =
      false /* ??????????????????????????????true */ && import.meta.env.DEV
    // eslint-disable-next-line vue/one-component-per-file
    const app = createApp({
      setup() {
        const state = reactive({
          imgUrl,
          price,
          successCallback(data: string) {
            resolve(data)
            !devPreview && minicardInstance.$el.remove()
          },
          failCallback() {
            resolve('')
            !devPreview && minicardInstance.$el.remove()
          },
          devPreview
        })
        return () => createVNode(Minicard, state, null)
      }
    })
    const minicardInstance = app.mount(document.createElement('div'))
    document.body.appendChild(minicardInstance.$el)
    /* ???????????????????????????????????? */
  })
}

/* ????????????????????????????????????????????? */
let videoPlayerInstance: any //??????VideoPlayer.vue?????????
export function videoPreview({ videoUrl = '' }) {
  if (videoPlayerInstance) {
    videoPlayerInstance.open(videoUrl)
    return
  }
  // eslint-disable-next-line vue/one-component-per-file
  const app = createApp({
    setup() {
      const state = reactive({
        show: false,
        videoUrl
      })
      const open = (videoUrl: string) => {
        state.videoUrl = videoUrl
        state.show = true
      }
      const toggle = (show: boolean) => {
        state.show = show
      }
      const currentInstance = getCurrentInstance()
      if (currentInstance) {
        // ?????????????????????????????????
        Object.assign(<any>currentInstance.proxy, {
          open
        })
      }
      return () =>
        createVNode(
          VideoPlayer,
          mergeProps(state, {
            'onUpdate:show': toggle //??????emit('update:show')
          }),
          null
        )
    }
  })
  videoPlayerInstance = app.mount(document.createElement('div'))
  document.body.appendChild(videoPlayerInstance.$el)
  videoPlayerInstance.open()
}

/* ?????????????????????????????? */
export function getLevel3CategoryIdBy4(level4CategoryId: number) {
  return Number(`${level4CategoryId}`.slice(0, 6))
}

/* ??????????????? */
export function telMask(tel = '') {
  return tel.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
}

/* ???????????? */
export function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

/* ???????????????iframe??? */
export function isInFrame() {
  return window.parent !== window.self
}

/* ?????????????????????ios12 */
export function isIos12() {
  const userAgent = navigator.userAgent
  if (/iP(hone|od|ad)/.test(userAgent)) {
    const v = userAgent.match(/OS\s+(\d+)_(\d+)_?(\d+)?/) || []
    return parseInt(v[1], 10) == 12
  } else {
    return false
  }
}
