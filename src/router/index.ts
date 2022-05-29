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
  },
  /* 自营摄影频道页 */
  {
    path: '/photography',
    name: 'photography',
    component: () => import('@/views/photography/Photography.vue')
  },
  /* 服务分享赚页 */
  {
    path: '/share-earn',
    name: 'shareEarn',
    component: () => import('@/views/share-earn/ShareEarn.vue')
  },
  /* 分享赚我的清单列表页 */
  {
    path: '/share-earn/share-list',
    name: 'shareList',
    component: () => import('@/views/share-earn/share-list/ShareList.vue')
  },
  /* 云客与企微的服务分享页 */
  {
    path: '/share-service',
    name: 'shareService',
    component: () => import('@/views/share-service/ShareService.vue')
  },
  /* 云客与企微的服务分享任务列表页 */
  {
    path: '/share-service/task-list',
    name: 'shareServiceTaskList',
    component: () => import('@/views/share-service/task-list/TaskList.vue')
  },
  /* 云客与企微的服务分享任务详情页 */
  {
    path: '/share-service/task/:taskId',
    name: 'shareServiceTaskDetail',
    component: () => import('@/views/share-service/task-detail/TaskDetail.vue')
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
