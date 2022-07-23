import { createApp } from 'vue'
// import { ConfigProvider } from 'vant'

import App from './App.vue'
import router from './router'
import store from './store'
import components from './plugins/components'
import directives from './plugins/directives'
import middlewares from './plugins/middlewares'
import mixins from './plugins/mixins'
import '@/assets/css/normalize.scss'

const app = createApp(App)
app.use(components)
app.use(directives)
app.use(middlewares)
app.use(mixins)
// app.use(ConfigProvider)
app.use(store).use(router).mount('#app')
