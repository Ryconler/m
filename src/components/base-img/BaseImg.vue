<template>
  <van-image v-bind="attrs" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Image as VanImage } from 'vant'
import { parseInt } from 'lodash'

export default defineComponent({
  components: {
    [VanImage.name]: VanImage
  },
  props: {
    width: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: [String, Number],
      default: ''
    },
    fit: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      default: ''
    }
  },
  computed: {
    attrs() {
      const attrs: any = JSON.parse(JSON.stringify(this.$props))
      if (attrs.width) {
        attrs.width = `${parseInt(attrs.width) / 75}rem`
      } else {
        attrs.width = '100%'
      }
      if (attrs.height) {
        attrs.height = `${parseInt(attrs.height) / 75}rem`
      }
      if (attrs.fit) {
        attrs.fit = attrs.fit
      } else {
        attrs.fit = 'cover'
      }
      return attrs
    }
  }
})
</script>
