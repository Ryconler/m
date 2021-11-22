<template>
  <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-else></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
}
body {
  // background-image: url('./assets/images/bg.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
#app {
  * {
    box-sizing: border-box;
  }
}
.clearfix::after {
  display: block;
  clear: both;
  visibility: hidden;
  height: 0;
  overflow: hidden;
  content: '';
}
</style>
