const userAgent = navigator.userAgent
console.log('userAgent', userAgent)

const iPhone = userAgent.match(/(iPhone\sOS)\s([\d_]+)/)
const iPad = userAgent.match(/(iPad).*OS\s([\d_]+)/)
const mac = userAgent.match(/(Mac\sOS)\s([\d_]+)/)
const wechat = userAgent.match(/(MicroMessenger)\/([\d\.]+)/i)
const android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/)

export const isIOS = !!iPhone || !!iPad || !!mac
export const isAndroid = !!android
