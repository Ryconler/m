<template>
  <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { isIOS } from './utils'

document.body.classList.add(isIOS ? 'ios' : 'android')

export default defineComponent({
  setup() {
    const store = useStore()
    store.dispatch('queryUserInfo')
  }
})
</script>

<style lang="scss">
body {
  background: #f1f1f1;
}
/*兼容iphoneX 底部 全局样式*/
@supports (bottom: constant(safe-area-inset-bottom)) or
  (bottom: env(safe-area-inset-bottom)) {
  .menu_wkBox_back_box {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.pf-medium {
  font-weight: 700;
}
.ios .pf-medium {
  font-weight: 500;
}

.pf-simbold {
  font-weight: 700;
}
.ios .pf-simbold {
  font-weight: 600;
}

.sticky-fix .van-sticky--fixed {
  &::before {
    content: '';
    display: block;
    position: absolute;
    background: var(--fix-bg);
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    // 必须要设置translateZ(0),开启gpu渲染
    transform: translateY(-2px) translateZ(0);
  }
}
.van-image-preview__overlay {
  &::before {
    content: '';
    display: block;
    position: absolute;
    background: rgba(0, 0, 0, 0.9);
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    // 必须要设置translateZ(0),开启gpu渲染
    transform: translateY(-2px) translateZ(0);
  }
}
.van-image-preview__image > * {
  transform: translateZ(0);
}
</style>
