import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import styleImport from 'vite-plugin-style-import'
import path from 'path'
import fs from 'fs'
import autoprefixer from 'autoprefixer'
import pxtorem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  console.log(command, mode)
  const IS_PROD = mode === 'production'

  return {
    plugins: [
      vue(),
      legacy(),
      styleImport({
        libs: [
          {
            libraryName: 'vant',
            esModule: true,
            resolveStyle: (name) => `vant/es/${name}/style`
          }
        ]
      })
    ],
    base: IS_PROD ? '/' : '/', // 设置打包路径
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 75,
            propList: ['*']
            // 不加 exclude: 'node_modules' ,打包后会出现部分px未转换的问题
          })
        ]
      },
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@import "@/assets/css/variables.scss";`
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      open: false,
      cors: true,
      // https: {
      //   cert: fs.readFileSync('./config/wzmxx.com.pem'),
      //   key: fs.readFileSync('./config/wzmxx.com.key')
      // }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: true,
      target: 'es2015'
    }
  }
}
