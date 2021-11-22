import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import styleImport from 'vite-plugin-style-import'
import path from 'path'
import autoprefixer from 'autoprefixer'
import pxtorem from 'postcss-pxtorem'

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  console.log(command, mode)
  const IS_PROD = mode === 'production'

  return {
    plugins: [
      vue(),
      legacy({
        targets: ['> 1%', 'last 1 version', 'ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
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
      },
      // 导入时想要省略的扩展名列表。注意，不建议忽略自定义导入类型的扩展名（例如：.vue)
      extensions: [
        '.mjs',
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
        '.vue',
        '.scss'
      ]
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
    clearScreen: false // 避免 Vite 清屏而错过在终端中打印某些关键信息
  }
}
