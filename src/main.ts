import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import directives from './plugins/directives'
import middlewares from './plugins/middlewares'
import mixins from './plugins/mixins'
import '@/assets/css/normalize.scss'
import 'vant/es/toast/style'
import 'vant/es/image-preview/style'

const app = createApp(App)
app.use(directives)
app.use(middlewares)
app.use(mixins)
app.use(store).use(router).mount('#app')
