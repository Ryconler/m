import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import { setupDirectives } from './plugins/directives'
import { setupMethods } from './plugins/middlewares'
import { setupMixins } from './plugins/mixins'
import '@/assets/css/normalize.scss'

const app = createApp(App)
setupDirectives(app)
setupMethods(app)
setupMixins(app)
app.use(store).use(router).mount('#app')
