import { Theme } from 'vitepress'
import Layout from './pages/Layout.vue'

export const getDefaultTheme = (): Theme => {
  return {
    Layout,
  }
}

export {
  Layout,
}