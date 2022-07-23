<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
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
html,
body {
  background: #f1f1f1;
}
#app {
  max-width: 10rem;
  margin: 0 auto;
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

.van-image-preview__image > * {
  transform: translateZ(0);
}

/* 部分机型使用fit-content宽度会有明显的变化过程 */
.van-toast--text {
  width: initial;
}
</style>
