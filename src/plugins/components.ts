import { App } from 'vue'
import BaseImg from '@/components/base-img/BaseImg.vue'
import ProductPrice from '@/components/product-price/ProductPrice.vue'

/**
 * 注册全组件
 * @param app
 */
export function setupComponents(app: App) {
  app.component('BaseImg', BaseImg)
  app.component('ProductPrice', ProductPrice)
}
