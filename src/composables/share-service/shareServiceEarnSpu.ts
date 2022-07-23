import { ShareSpuType } from '@/constant/shareService'
import { getMinicardUrl, sleep, toDemotion } from '@/utils'
import { isNumber } from 'lodash'
import { ImagePreview, Toast } from 'vant'
import { computed, Ref } from 'vue'

export const useSpuInfo = (spu: Ref<ShareSpuType>, realSpuId: Ref<number>) => {
  const spuLink = computed(() => {
    return '/xbuy-event/1'
  })
  const spuSaleNum = computed(() => {
    const saleNum = +(<number>spu.value.saleNum)
    if (saleNum >= 10000) {
      return toDemotion(saleNum, 10000) + '万'
    }
    if (isNumber(saleNum)) {
      return saleNum
    }
    return 0
  })
  const spuInfoClick = async () => {
    location.href = spuLink.value
  }
  return { spuLink, spuSaleNum, spuInfoClick }
}

export const useSpuShare = (
  spu: Ref<ShareSpuType>,
  realSpuId: Ref<number>,
  shareCityCode: Ref<string>
) => {
  const spuShareClick = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    Toast.loading({
      forbidClick: true,
      duration: 0,
      message: '加载中...'
    })
    const shareMinicard =
      (await getMinicardUrl(
        <string>spu.value.cmmdtyImage,
        spu.value.minPrice
      )) ||
      spu.value.cmmdtyImage ||
      ''
    Toast('模拟拉起原生分享面板成功')
    await sleep(1500)
    ImagePreview([shareMinicard])
  }
  return {
    spuShareClick
  }
}
