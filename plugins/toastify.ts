import { provide } from 'vue'
import Vue3Toasity, { type ToastContainerOptions, toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((app) => {
  app.vueApp.use(Vue3Toasity) as ToastContainerOptions
  return {
    provide: {
      toastify: toast
    }
  }
})