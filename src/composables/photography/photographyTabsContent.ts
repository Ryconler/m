import {
  PhotoContentProductType,
  PhotoMinProductType
} from '@/constant/photography'
import { toNumber } from 'lodash'

interface PhotoItemType {
  photeRepairNum: string
  photoNum: string
}
export function getPhotonumText(photoItem: string) {
  if (photoItem) {
    try {
      const items: PhotoItemType[] = JSON.parse(photoItem)
      if (items.length > 0) {
        const photeRepairNum = items[0].photeRepairNum
        const photoNum = items[0].photoNum
        return `拍摄≥${photoNum}张 | ${photeRepairNum}张精修`
      }
    } catch (e) {
      console.error(e)
    }
  }
  return ''
}

export function getProductUrl(
  product: PhotoContentProductType | PhotoMinProductType
) {
  return 'https://baidu.com'
}
