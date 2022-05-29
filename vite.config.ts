import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
import path from 'path'
import autoprefixer from 'autoprefixer'
import pxtorem from 'postcss-pxtorem'
import { defineConfig } from 'vite'

function getVersion() {
  function add0(num) {
    return num < 10 ? `0${num}` : `${num}`
  }
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${year}${add0(month)}${add0(day)}${add0(hours)}${add0(minutes)}${add0(
    seconds
  )}`
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log(command, mode)
  return {
    plugins: [
      vue(),
      legacy(),
      styleImport({
        resolves: [VantResolve()]
      })
    ],
    base: '/', // 设置打包路径
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            // index.html设置了1rem=clientWidth/10；设计稿的屏幕宽度是750，所以这里设75可以在代码中直接使用设计稿给的尺寸
            rootValue: 75, // 1px -> 1/75rem
            propList: ['*']
            // 不加 exclude: 'node_modules' ,打包后会出现部分px未转换的问题
          })
        ]
      },
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@import "@/assets/css/variables.scss";@import "@/assets/css/vant-config.scss";`
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        types: path.resolve(__dirname, 'types')
      }
    },
    server: {
      open: false,
      cors: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: true,
      target: 'es2015'
    },
    define: {
      __H5_VERSION__: getVersion()
    }
  }
})
