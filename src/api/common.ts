import urlPrefixes from '@/constant/urlPrefixes'
import { ajax, http } from '@/utils'
import jsCookie from 'js-cookie'
import qs from 'query-string'

const api = {
  queryDistricts: `${urlPrefixes.addressapi}/addressview/GetDistrictList`,
  queryUserInfo: `${urlPrefixes.userapi}/user/GetUserInfo`,
  queryShareKey: `${urlPrefixes.mallbackapi}/share/commercialInterface/getKey.do`,
  queryCmmdtyDetail: `${urlPrefixes.sccapi}/api/spu/queryCmmdtyDetail.do`,
  uploadImageMedia: `${urlPrefixes.workchatapi}/workchat-media/web/c/v1/upload-image-media`,
  getImageMedia: `${urlPrefixes.workchatapi}/workchat-media/web/c/v1/image-mediaid`,
  getVideoMedia: `${urlPrefixes.workchatapi}/workchat-media/web/c/v1/video-mediaid`,
  uplodaImageCMS: `${urlPrefixes.imsapi}/pic/file/upload.do`,
  getMinicode: `${urlPrefixes.miniappqrcodeapi}/api/v1/qrcode/new/qrcode`
}

export async function queryDistricts(cityId: number | string) {
  try {
    const result: any = await ajax.get(`${api.queryDistricts}?cityId=${cityId}`)
    const { DistrictList } = result
    return DistrictList || []
  } catch (e) {
    return []
  }
}

export async function queryUserInfo({
  visitkey,
  padetail,
  pregnant
}: any = {}) {
  try {
    const uid = jsCookie.get('uid')
    const skey = jsCookie.get('skey')
    if (!uid || !skey) {
      return null
    }
    const query = qs.stringify({
      uid,
      skey,
      visitkey,
      padetail,
      pregnant
    })
    const result: any = await ajax.get(`${api.queryUserInfo}?${query}`)
    if (result.errno === 0) {
      return result.data || null
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

/**
 * http://wiki.haiziwang.com/xwiki/bin/view/Main/%E5%95%86%E5%9F%8E%E4%BA%A7%E5%93%81%E7%A0%94%E5%8F%91/%E5%88%86%E4%BA%ABKey%E7%B3%BB%E7%BB%9F-share/%E8%8E%B7%E5%8F%96Key%E6%8E%A5%E5%8F%A3/
 */
export async function queryShareKey(params = {}) {
  const uid = jsCookie.get('uid')
  if (!uid) {
    return ''
  }

  try {
    const jsonobj = {}
    const url = `${api.queryShareKey}?jsonobj=${encodeURIComponent(
      JSON.stringify(jsonobj)
    )}`
    const res: any = await ajax.get(url)
    if (+res.result === 0) {
      return res.data || ''
    } else {
      return ''
    }
  } catch (error) {
    return ''
  }
}

export async function getShareImage(params: {
  imageurl: string
  price: number
  product_name: string
}) {
  const query_param = {
    source: 'HZWMALL_android',
    scene_id: 1,
    entity_id: 8000,
    ...params
  }
  const query = qs.stringify(query_param)
  const result: any = await ajax.get(
    `//social.cekid.com/shequn-business/web/c/v1/shareimage?${query}`
  )
  return result.data || {}
}
/* 查询商品详情 */
export async function queryCmmdtyDetail(param: {
  skuId: number
  spuId: number
}) {
  const uid = jsCookie.get('uid')
  const skey = jsCookie.get('skey')
  const query = qs.stringify({
    uid,
    skey,
    ...param
  })
  const result: any = await ajax.get(`${api.queryCmmdtyDetail}?${query}`)
  if (result.code == '1') {
    return result.data || {}
  } else {
    return {}
  }
}

/* 上传图片临时素材获取MediaId */
export async function uploadImageMedia(file: File) {
  const param = new FormData()
  param.append('file', file)
  const result: any = await http.post(`${api.uploadImageMedia}`, param, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  if (result.code == 1001) {
    return result.data || {}
  } else {
    return {}
  }
}

/* 根据图片url获取media_id */
export async function getImageMedia(videoUrl: string) {
  const result: any = await http.get(`${api.getImageMedia}?`)
  if (result.code == 1001) {
    return result.data || {}
  } else {
    return {}
  }
}

/* 根据视频url获取media_id */
export async function getVideoMedia(videoUrl: string) {
  const result: any = await http.get(`${api.getVideoMedia}`)
  if (result.code == 1001) {
    return result.data || {}
  } else {
    return {}
  }
}

/* 上传图片获取网络地址 */
export async function uplodaImageCMS(file: File) {
  const param = new FormData()
  param.append('file', file, file.name)
  const result: any = await http.post(
    `${api.uplodaImageCMS}?bucket=cmspic`,
    param,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  )
  if (result.code == 0) {
    return result.content || {}
  } else {
    return {}
  }
}

/* 获取小程序码 */
export async function getMinicode(path: string, shareKey: string) {
  const param = qs.stringify({
    tag: 'hzw_mall',
    width: 280,
    token_data: JSON.stringify({
      path,
      share_key: shareKey
    })
  })
  const result: any = await http.get(`${api.getMinicode}?${param}`)
  if (result.code == 1001 && result.data) {
    return result.data.qrcode || ''
  } else {
    return ''
  }
}
