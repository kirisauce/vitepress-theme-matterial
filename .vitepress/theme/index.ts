// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import { getDefaultTheme } from '../../src'

export default {
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  extends: getDefaultTheme()
} satisfies Theme

