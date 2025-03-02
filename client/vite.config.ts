import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.join('../certs', process.env.HTTPS_KEY_FILENAME!)),
      cert: fs.readFileSync(path.join('../certs', process.env.HTTPS_CERT_FILENAME!)),
    },
    host: 'localhost',
    port: Number(process.env.VUE_PORT)!,
    open: true,
  },

  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
