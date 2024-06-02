// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  app: {
    head: {
      title: "Manajemen Sistem Inventaris Barang"
    } 
  },
  devtools: { enabled: false },
  watch: ['./pages/**', './components/**'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    server:{
      watch: {
        usePolling: true,
        ignored: ["node_modules", ".git"]
      }
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
