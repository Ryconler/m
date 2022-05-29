import jsCookie from 'js-cookie'
import { divide, isEmpty, isString, round, toNumber } from 'lodash'
import Clipboard from 'clipboard'

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
