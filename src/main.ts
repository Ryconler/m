import { createApp } from 'vue'
import { ConfigProvider } from 'vant'

import App from './App.vue'
import router from './router'
import store from './store'
import { setupComponents } from './plugins/components'
import { setupDirectives } from './plugins/directives'
import { setupMethods } from './plugins/middlewares'
import { setupMixins } from './plugins/mixins'
import '@/assets/css/normalize.scss'

const app = createApp(App)
setupComponents(app)
setupDirectives(app)
setupMethods(app)
setupMixins(app)
app.use(ConfigProvider)
app.use(store).use(router).mount('#app')
