import { participateEvent } from '@/api/xbuyEvent'
import { EventType } from '@/constant/xbuyEvent'
import jsCookie from 'js-cookie'
import qs from 'query-string'
import { Toast } from 'vant'

export const toShare = async () => {
  Toast('请在App或小程序中打开页面进行分享')
}

/* 跳订单确认页，复制商详逻辑 */
export const goPurchase = (eventInfo: EventType, skuDetail: any) => {
  function setConfirmQuery({
    spuId,
    storeInfo,
    query,
    isCustomisedGoods = true
  }: any) {
    const parentSpuId = spuId

    // 定制SKU商品 更换门店后，同步更新spuId, skuId
    if (isCustomisedGoods) {
      if (storeInfo) {
        // 门店模块已加载完毕
        const { spuId: _spuId, skuId, businessKey } = storeInfo
        spuId = _spuId
        Object.assign(query, {
          skuId,
          businessKey
        })
      } else {
        // 门店模块未加载完毕即跳转至订单提交页
        Object.assign(query, {
          beforeMLoaded: true
        })
      }
    }
    Object.assign(query, {
      parentSpuId,
      isCustomisedGoods
    })
    // query为引用类型
    return {
      spuId,
      query
    }
  }

  function getCZJConfirmUrl(query: any) {
    //成长加订单确认页
    const queryStr = qs.stringify({
      ...query,
      cmd: 'share',
      sharetype: 0,
      refresh: 'no'
    })

    const url = `https://ms.czj100.com/deal/confirmOrder?${queryStr}&uid=${
      jsCookie.get('uid') || ''
    }&skey=${jsCookie.get('skey') || ''}`
    return url
  }

  const { spuId, skuId } = eventInfo
  const { spuType, source, saleAttribute, businessType } = skuDetail

  const isCustomisedGoods = (() => {
    return 1 === +saleAttribute && source === 5
  })()

  const query = {
    ruleId: '',
    ruleType: 12, //对应下单时的channelType
    empId: '',
    skuId,
    isCustomisedGoods,
    hserecomkey: ''
  }
  const { spuId: newSpuId } = setConfirmQuery({
    spuId,
    storeInfo: null,
    query,
    isCustomisedGoods
  })
  const isCzjSpu = !(spuType && spuType === 402)
  if (isCzjSpu && (+businessType === 22 || +businessType === 23)) {
    //互动活动的商家类型走成长加确认页
    const url = getCZJConfirmUrl(query)
    location.href = url
  } else {
    location.href = `//life.cekid.com/v/product/${newSpuId}/confirm?${qs.stringify(
      {
        ...query,
        cmd: 'share',
        sharetype: 0,
        refresh: 'no'
      }
    )}`
  }
}

export const goOrder = (eventInfo: EventType) => {
  const { orderId, level4CategoryId } = eventInfo
  const issys = 1
  location.href = `//life.cekid.com/v/order/${orderId}?cmd=share&sharetype=0&isys=${issys}&kwtarget=blank`
}

export const reParticipate = async (eventInfo: EventType) => {
  await participateEvent(eventInfo.id, eventInfo.skuId)
  location.replace(
    `/v2/xbuy-event/${eventInfo.id}?skuId=${eventInfo.skuId}&naviType=3`
  )
}

export const metooParticipate = (eventInfo: EventType) => {
  location.replace(
    `/v2/xbuy-event/${eventInfo.id}?skuId=${eventInfo.skuId}&naviType=3`
  )
}
