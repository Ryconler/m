import { ICircleShape, IRoundedRectangleShape, ISquareShape } from './recognize'

export function drawCircleImage(
  ctx: CanvasRenderingContext2D,
  shape: ICircleShape,
  imgUrl: string
) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imgUrl
    img.onload = function () {
      const { centerX, centerY, r } = shape
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(img, centerX - r, centerY - r, r * 2, r * 2)
      ctx.restore()
      resolve()
    }
    img.onerror = function () {
      reject(`绘制失败：加载图片资源${imgUrl}异常`)
    }
  })
}

export function drawRoundRectangleShape(
  ctx: CanvasRenderingContext2D,
  shape: IRoundedRectangleShape,
  imgUrl: string
) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imgUrl
    img.onload = function () {
      // todo round edge
      const { x, y, w, h } = shape
      ctx.drawImage(img, x, y, w, h)
      resolve()
    }
    img.onerror = function () {
      reject(`绘制失败：加载图片资源${imgUrl}异常`)
    }
  })
}

export function drawSquareShape(
  ctx: CanvasRenderingContext2D,
  shape: ISquareShape,
  imgUrl: string
) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imgUrl
    img.onload = function () {
      // todo round edge
      const { x, y, w, h } = shape
      ctx.drawImage(img, x, y, w, h)
      resolve()
    }
    img.onerror = function () {
      reject(`绘制失败：加载图片资源${imgUrl}异常`)
    }
  })
}
