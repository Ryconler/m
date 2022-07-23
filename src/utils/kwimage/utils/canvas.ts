
/**
 * 获取 canvas 实例
 * @param tagName 
 * @returns 
 */
export function getCanvasInstance(tagName: string): HTMLCanvasElement {
  return document.createElement(tagName) as HTMLCanvasElement
}

export default {
  getCanvasInstance,
}
