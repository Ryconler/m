import { ShareSpuType } from '@/constant/shareService'
import { getMinicardUrl, toDemotion } from '@/utils'
import { isNumber, toNumber } from 'lodash'
import { Toast } from 'vant'
import { computed, Ref } from 'vue'

export const useSpuInfo = (spu: Ref<ShareSpuType>, realSpuId: Ref<number>) => {
  const spuLink = computed(() => {
    return 'https://m.wzmxx.com'
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
  const { spuLink } = useSpuInfo(spu, realSpuId)
  const realSkuId = computed(() => {
    return spu.value.templateType2Id == 601 &&
      realSpuId.value != spu.value.spuId
      ? spu.value.spuId
      : undefined
  })
  const spuShareClick = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    if (spu.value.materialFlag) {
      location.href = `/v2/share-service/material-list/${
        realSpuId.value
      }?skuId=${realSkuId.value || ''}&shareCityCode=${
        shareCityCode.value
      }&templateType2Id=${spu.value.templateType2Id}&kwtarget=blank`
      return
    }
    Toast.loading({
      forbidClick: true,
      duration: 0,
      message: '加载中...'
    })
    const shareLink = spuLink.value
    const shareTitle = <string>spu.value.spuName
    const shareRemark = JSON.stringify({
      url: shareLink
    })
    const shareMinicard =
      (await getMinicardUrl(
        <string>spu.value.cmmdtyImage,
        spu.value.minPrice
      )) || spu.value.cmmdtyImage
    //分享小程序卡片封面 5:4
    const sharePosterimg = spu.value.cmmdtyImage
    //分享海报图 11
    Toast('分享成功')
  }
  return {
    spuShareClick
  }
}
