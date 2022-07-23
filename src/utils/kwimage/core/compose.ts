import { getCanvasInstance } from '../utils/canvas'
import {
  drawCircleImage,
  drawRoundRectangleShape,
  drawSquareShape,
} from './draw'
import { recognizeShape } from './recognize'

interface IComposeImageParam {
  resourceImage: string // 镂空图背景资源
  blankAreaImage: string //镂空区域图片资源
  format?: 'image/jpeg' | 'image/png'
  quality?: string
}

export function composeImage(param: IComposeImageParam) {
  return new Promise((resolve, reject) => {
    const { resourceImage, blankAreaImage, format, quality } = param
    if (!resourceImage || !blankAreaImage) {
      reject('图片不能为空！')
      return
    }
    const canvas = getCanvasInstance('CANVAS')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject('画布为空')
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = resourceImage
    img.onload = function () {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const points: number[][] = []
      for (let i = 1; i <= img.height; i++) {
        points[i] = []
      }
      for (let i = 0; i < data.length; i += 4) {
        const index = (i + 4) / 4
        const y = Math.ceil(index / img.width)
        const x = (i - (y - 1) * img.width * 4) / 4
        if (data[i + 3] === 0) {
          points[y][x] = 1
          data[i] = 255
          data[i + 1] = 255
          data[i + 2] = 255
          data[i + 3] = 255
        } else {
          points[y][x] = 0
        }
      }
      ctx.putImageData(imageData, 0, 0)
      const shapeInfo = recognizeShape({
        points: points,
        imgHeight: img.height,
        imgWidth: img.height,
      })
      switch (shapeInfo.type) {
        case 'Circle':
          if (shapeInfo.circleShape) {
            drawCircleImage(ctx, shapeInfo.circleShape, blankAreaImage)
              .then(() => {
                resolve(
                  canvas.toDataURL(format || 'image/png', quality || '0.8')
                )
              })
              .catch((reason) => {
                reject(reason)
              })
          }
          break
        case 'EmptyPixel':
          reject('该图片无镂空区域')
          break
        case 'RoundedRectangle':
          if (shapeInfo.roundedRectangleShape) {
            drawRoundRectangleShape(
              ctx,
              shapeInfo.roundedRectangleShape,
              blankAreaImage
            )
              .then(() => {
                resolve(canvas.toDataURL(format, quality))
              })
              .catch((reason) => {
                reject(reason)
              })
          }
          break
        case 'Square':
          if (shapeInfo.squareShape) {
            drawSquareShape(ctx, shapeInfo.squareShape, blankAreaImage)
              .then(() => {
                resolve(canvas.toDataURL(format, quality))
              })
              .catch((reason) => {
                reject(reason)
              })
          }
          break
        default:
          reject('暂不支持该图形')
          break
      }
    }
    img.onerror = function () {
      reject(`合成图片失败：资源图片${resourceImage}加载异常，请稍后重试`)
    }
  })
}
