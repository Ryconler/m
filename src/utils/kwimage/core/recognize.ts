import { getCanvasInstance } from "../utils/canvas";

interface IRecognizeShapeParam {
  points: number[][];
  imgWidth: number;
  imgHeight: number;
}

export interface ICircleShape {
  centerX: number;
  centerY: number;
  r: number;
}

export interface IRoundedRectangleShape {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ISquareShape {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface IRecognizeShapeResult {
  type:
    | "Circle"
    | "Unknown"
    | "Rectangle"
    | "RoundedRectangle"
    | "Square"
    | "EmptyPixel";
  circleShape?: ICircleShape;
  roundedRectangleShape?: IRoundedRectangleShape;
  squareShape?: ISquareShape;
}

export function recognizeShape(
  param: IRecognizeShapeParam
): IRecognizeShapeResult {
  const { points, imgWidth } = param;
  const xyPixels: any = {};
  for (let i = 1; i <= points.length - 1; i++) {
    const xPixels = [];
    for (let j = 0; j < points[i].length; j++) {
      if (points[i][j] === 1) {
        xPixels.push(j);
      }
    }
    if (xPixels.length > imgWidth / 3) {
      continue;
    }
    if (xPixels.length > 0) {
      xyPixels[i] = xPixels;
    }
  }
  const shapeResult: IRecognizeShapeResult = { type: "EmptyPixel" };
  const keys = Object.keys(xyPixels);
  if (keys.length === 0) {
    // 没有镂空图
    return shapeResult;
  }
  // to find max width and min width of x Axis
  let maxWidth = xyPixels[keys[0]].length;
  let minWidth = xyPixels[keys[0]].length;
  for (let key of keys) {
    const length = xyPixels[key].length;
    maxWidth = Math.max(maxWidth, length);
    minWidth = Math.min(minWidth, length);
  }
  // to calc width rate between max and min width
  const wRate = minWidth / maxWidth;

  if (wRate < 0.5) {
    const maxWdithIntervals = keys.filter(
      (key) => xyPixels[key].length === maxWidth
    );
    if (maxWdithIntervals && maxWdithIntervals.length > 0) {
      const centerYIndex = Math.floor(maxWdithIntervals.length / 2);
      const yPoints = xyPixels[maxWdithIntervals[centerYIndex]];
      if (yPoints && yPoints.length > 0) {
        const startX = yPoints[0];
        const endX = yPoints[yPoints.length - 1];
        const r = Math.floor((endX - startX) / 2);
        const centerX = yPoints[r];
        const centerY = Number(maxWdithIntervals[centerYIndex]);
        shapeResult.circleShape = {
          centerX: centerX,
          centerY: centerY,
          r: r,
        };
      }
    }
    shapeResult.type = "Circle";
    return shapeResult;
  }
  const startY = Number(keys[0]);
  const startX = xyPixels[keys[0]][0];
  const endY = Number(keys[keys.length - 1]);
  const endX = xyPixels[`${endY}`][xyPixels[`${endY}`].length - 1];
  if (wRate < 0.95) {
    // 圆角矩形
    shapeResult.type = "RoundedRectangle";
    shapeResult.roundedRectangleShape = {
      x: startX,
      y: startY,
      w: endX - startX,
      h: endY - startY,
    };
    return shapeResult;
  }
  shapeResult.type = "Square";
  shapeResult.squareShape = {
    x: startX,
    y: startY,
    w: endX - startX,
    h: endY - startY,
  };
  return shapeResult;
}

export function checkImageHasBlankArea(imgUrl: string) {
  return new Promise<boolean>((resolve, reject) => {
    if (!imgUrl) {
      reject("图片地址不能为空！");
      return;
    }
    const canvas = getCanvasInstance("CANVAS");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject("画布为空！");
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const points: number[][] = [];
      for (let i = 1; i <= img.height; i++) {
        points[i] = [];
      }
      for (let i = 0; i < data.length; i += 4) {
        const index = (i + 4) / 4;
        const y = Math.ceil(index / img.width);
        const x = (i - (y - 1) * img.width * 4) / 4;
        if (data[i + 3] === 0) {
          points[y][x] = 1;
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255;
        } else {
          points[y][x] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const shapeInfo = recognizeShape({
        points: points,
        imgHeight: img.height,
        imgWidth: img.height,
      });
      const hasBlankArea =
        shapeInfo.type === "Circle" ||
        shapeInfo.type === "Rectangle" ||
        shapeInfo.type === "RoundedRectangle" ||
        shapeInfo.type === "Square";
      resolve(hasBlankArea);
    };
    img.onerror = function () {
      reject(`加载资源失败：资源图片（${imgUrl}）加载异常，请稍后重试`);
    };
  });
}
