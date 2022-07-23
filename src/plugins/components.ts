import { App } from 'vue'
import BaseImg from '@/components/base-img/BaseImg.vue'
import TitleBar from '@/components/title-bar/TitleBar.vue'
import ClassifySort from '@/components/classify-sort/ClassifySort.vue'
import EmptyError from '@/components/empty-error/EmptyError.vue'
import SearchBar from '@/components/search-bar/SearchBar.vue'
import ProductPrice from '@/components/product-price/ProductPrice.vue'
import ProductPrice2 from '@/components/product-price/ProductPrice2.vue'
import ProductPrice3 from '@/components/product-price/ProductPrice3.vue'
import ProductCell from '@/components/product-cell/ProductCell.vue'
import VideoPlayer from '@/components/video-player/VideoPlayer.vue'
import MediaPreview from '@/components/media-preview/MediaPreview.vue'

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
  app.component('ProductPrice', ProductPrice)
  app.component('ProductPrice2', ProductPrice2)
  app.component('ProductPrice3', ProductPrice3)
  app.component('ProductCell', ProductCell)
  app.component('VideoPlayer', VideoPlayer)
  app.component('MediaPreview', MediaPreview)
}
