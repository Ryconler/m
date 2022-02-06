import { App } from 'vue'
import { Toast } from 'vant'

/**
 * 注册全局方法
 * @param app
 */
export function setupMethods(app: App) {
  app.config.globalProperties.$toast = Toast
}
