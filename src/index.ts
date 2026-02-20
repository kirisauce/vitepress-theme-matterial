import { Theme } from 'vitepress'
import Layout from './pages/Layout.vue'
import Heimu from './components/Heimu.vue'

export const getDefaultTheme = (): Theme => {
  return {
    Layout,

    enhanceApp: ({ app }) => {
      app.component('heimu', Heimu)
    },
  }
}

export {
  Layout,
}