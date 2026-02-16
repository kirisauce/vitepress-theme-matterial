import { Theme } from 'vitepress'
import Layout from './layouts/Layout.vue'

export const getDefaultTheme = (): Theme => {
  return {
    Layout,
  }
}

export {
  Layout,
}