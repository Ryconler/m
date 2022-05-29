import { App } from 'vue'
import BaseImg from '@/components/base-img/BaseImg.vue'
import TitleBar from '@/components/title-bar/TitleBar.vue'
import ClassifySort from '@/components/classify-sort/ClassifySort.vue'
import EmptyError from '@/components/empty-error/EmptyError.vue'
import SearchBar from '@/components/search-bar/SearchBar.vue'

/**
 * 注册全组件
 * @param app
 */
export default (app: App) => {
  app.component('BaseImg', BaseImg)
  app.component('TitleBar', TitleBar)
  app.component('ClassifySort', ClassifySort)
  app.component('EmptyError', EmptyError)
  app.component('SearchBar', SearchBar)
}
