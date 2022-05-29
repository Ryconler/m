import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteRecordRaw
} from 'vue-router'
import vconsole from 'vconsole'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/city-choose',
    name: 'cityChoose',
    component: () => import('@/views/city-choose/CityChoose.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/Search.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue')
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
      new vconsole()
    }
    next()
  }
)

router.afterEach(() => {})

export default router
