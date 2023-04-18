import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import * as path from 'path' 


export default defineConfig({
  plugins: [
    vue(),
    // Element Plus的配置
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // 路劲配置，src简写为@
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
