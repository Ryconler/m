import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteRecordRaw
} from 'vue-router'
import { setLoading } from '@/utils'
import Home from '@/views/home/Home.vue'
import CheckList from '@/views/check-list/CheckList.vue'
import Page1 from '@/views/page1/Page1.vue'
import CityChoose from '@/views/city-choose/CityChoose.vue'
import Search from '@/views/search/Search.vue'
import Login from '@/views/login/Login.vue'

const routes: Array<RouteRecordRaw> = [
  /* 首页 */
  {
    path: '/',
    alias: '/home',
    name: 'home',
    component: Home,
    meta: { keepAlive: true }
  },
  /* 清单列表 */
  {
    path: '/check-list',
    name: 'checkList',
    component: CheckList,
    meta: { keepAlive: true }
  },
  /* 页1 */
  {
    path: '/page1',
    name: 'page1',
    component: Page1,
    meta: { keepAlive: true }
  },
  {
    path: '/city-choose',
    name: 'cityChoose',
    component: CityChoose,
    meta: { keepAlive: true }
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    meta: { keepAlive: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { keepAlive: true }
  }
]

const scrollBehavior = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
  savedPosition: any
) => {
  if (!from.name) {
    // 没有来源路由，刷新页面
    // 为防止数据没有加载但是吸顶已经上去了，不返回原先的滚动条位置
    return {
      left: 0,
      top: 0
    }
  }
  if (savedPosition) {
    return savedPosition
  } else {
    if (to.hash) {
      return {
        el: to.hash
      }
    } else {
      return {
        left: 0,
        top: 0
      }
    }
  }
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior,
  routes
})

router.beforeEach(
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    if (Object.keys(to.query).indexOf('_debug') > -1) {
      import('vconsole').then((v) => {
        new v.default()
      })
    }
    setLoading()
    next()
  }
)

router.afterEach(() => {
  setLoading(false)
})

export default router
