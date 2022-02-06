import jsCookie from 'js-cookie'

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

export async function ensureLogin(url?: string) {
  const uid = jsCookie.get('uid')
  const skey = jsCookie.get('skey')
  if (uid && skey) {
    return {
      uid,
      skey
    }
  }
  const referUrl = url || location.href
  location.href = `//passport.cekid.com/passport/login?cmd=login&referer=${encodeURIComponent(
    referUrl
  )}`
  throw {}
}
