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
import { getMinicode } from '@/api/common'
import kwimage from './kwimage'
import queryString from 'query-string'

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

/* 获取分享赚金额范围 "{\"minShareAmount\":0,\"maxShareAmount\":30}" */
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

/* rem转响应式后的实际尺寸 */
export function rem2RealPx(rem: number) {
  return rem * parseFloat(document.documentElement.style.fontSize)
}

/* 复制文字到剪贴板 */
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
  const mime = arr[0].match(/:(.*?);/) // 此处得到的为文件类型
  const type = (mime && mime[1]) || '' // 此处得到的为文件类型
  const bstr = atob(arr[1]) // 此处将base64解码
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  // 通过以下方式将以上变量生成文件对象，三个参数分别为文件内容、文件名、文件类型
  return new File([u8arr], fileName, { type })
}

/* url拼接kwtarget=blank */
export function getKwtargetUrl(url: string) {
  const urlObj = queryString.parseUrl(url)
  urlObj.query.kwtarget = 'blank'
  return queryString.stringifyUrl(urlObj)
}

/* url参数替换*/
export function replaceUrlKey(url: string, key: string, value: string) {
  const urlObj = queryString.parseUrl(url)
  urlObj.query[key] = value
  return queryString.stringifyUrl(urlObj)
}

/* 读取cookie替换字符串中的同名参数值  */
export function replaceStrCookie(str: string, sign = '#') {
  // 只替换每个成对#中间的，单个#不替换
  // 例1: "https://life.cekid.com/v/product/123?entityId=#nodeCode#&uid=#uid#&kwtarget=blank"
  //  =>  "https://life.cekid.com/v/product/123?entityId=8002&uid=1300000139&kwtarget=blank"
  // 例2: "https://life.cekid.com/v/product/123?entityId=#nodeCode#&uid=#uid##id-1"
  //  =>  "https://life.cekid.com/v/product/123?entityId=8002&uid=1300000139#id-1"
  const strSplits = str.split(sign)
  let result = ''
  strSplits.forEach((item, index) => {
    // split后，非最后一个的奇数索引是待替换的值
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

/* 获取带二维码的海报 */
export async function getPosterBase64(
  bgimg: string,
  insuranceId = 0,
  shareLink = '',
  hserecomkey = ''
): Promise<string> {
  let qrcodeResource = ''
  if (shareLink) {
    const storeCode =
      jsCookie.get('storeCodeH5') || jsCookie.get('nodeCode') || ''
    shareLink = shareLink.replace(/#storeCode#/g, storeCode)
    const minicode = await getMinicode(shareLink, hserecomkey)
    qrcodeResource = `data:image/png;base64,${minicode}`
  } else if (insuranceId > 0) {
    const uid = jsCookie.get('uid')
    const skey = jsCookie.get('skey')
    qrcodeResource = `${urlPrefixes.xingbeibaoxianapi}/sharew/item/ercode?itemId=${insuranceId}&uid=${uid}&skey=${skey}`
  }
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
    // 可能外面有使用错误信息的必要，抛出
    throw e
  }
}

/* 获取带价格标签的图 */
export async function getMinicardUrl(
  imgUrl: string,
  price?: number
): Promise<string> {
  return new Promise(resolve => {
    const devPreview =
      false /* 开发需要预览时修改为true */ && import.meta.env.DEV
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
    /* 等待图片加载完成调用回调 */
  })
}

/* 视频预览播放（组件的方法调用） */
let videoPlayerInstance: any //组件VideoPlayer.vue的实例
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
        // 给实例暴露外部调用方法
        Object.assign(<any>currentInstance.proxy, {
          open
        })
      }
      return () =>
        createVNode(
          VideoPlayer,
          mergeProps(state, {
            'onUpdate:show': toggle //接收emit('update:show')
          }),
          null
        )
    }
  })
  videoPlayerInstance = app.mount(document.createElement('div'))
  document.body.appendChild(videoPlayerInstance.$el)
  videoPlayerInstance.open()
}

/* 四级品类提取三级品类 */
export function getLevel3CategoryIdBy4(level4CategoryId: number) {
  return Number(`${level4CategoryId}`.slice(0, 6))
}

/* 手机号掩码 */
export function telMask(tel = '') {
  return tel.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
}

/* 延迟执行 */
export function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

/* 判断是否在iframe中 */
export function isInFrame() {
  return window.parent !== window.self
}

/* 判断设备是否为ios12 */
export function isIos12() {
  const userAgent = navigator.userAgent
  if (/iP(hone|od|ad)/.test(userAgent)) {
    const v = userAgent.match(/OS\s+(\d+)_(\d+)_?(\d+)?/) || []
    return parseInt(v[1], 10) == 12
  } else {
    return false
  }
}
