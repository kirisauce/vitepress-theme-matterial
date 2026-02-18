import { defineConfig } from 'vitepress'
import { getDefaultConfig } from '../src/node'
import { ThemeConfig } from '../src/shared'

// https://vitepress.dev/reference/site-config
export default async () => defineConfig<ThemeConfig>({
  srcDir: "posts",

  title: "kirisauce's blog",
  description: "kirisauce's blog",

  themeConfig: {
    navigator: {
      siteText: 'kirisauce',
    },

    author: 'kirisauce',
    authorProfiles: {
      'kirisauce': {},
    },

    license: {
      default: 'cc-by-nc-4.0',
    },

    layout: {
      home: {
        secondaryTitle: 'none',
      },
    },
  },

  extends: await getDefaultConfig(),
})
