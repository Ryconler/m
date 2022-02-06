import { App } from 'vue'
import BaseImg from '@/components/base-img/BaseImg.vue'
import ElementItem from '@/components/element-item/ElementItem.vue'
import ElementNum from '@/components/element-num/ElementNum.vue'
import ElementNum2 from '@/components/element-num/ElementNum2.vue'
import ElementCell from '@/components/element-cell/ElementCell.vue'
import TitleBar from '@/components/title-bar/TitleBar.vue'
import ClassifySort from '@/components/classify-sort/ClassifySort.vue'
import EmptyError from '@/components/empty-error/EmptyError.vue'

/**
 * 注册全组件
 * @param app
 */
export function setupComponents(app: App) {
  app.component('BaseImg', BaseImg)
  app.component('ElementItem', ElementItem)
  app.component('ElementNum', ElementNum)
  app.component('ElementNum2', ElementNum2)
  app.component('ElementCell', ElementCell)
  app.component('TitleBar', TitleBar)
  app.component('ClassifySort', ClassifySort)
  app.component('EmptyError', EmptyError)
}
