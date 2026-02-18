import { defineConfig } from 'vitepress'
import { getDefaultConfig } from '../src/node'
import { ThemeConfig } from '../src/shared'

const myBio = `
test line 1
test line 2
test line 3
`

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
      kirisauce: {
        avatar: 'https://avatars.githubusercontent.com/u/81839503',
        bio: myBio,

        externalLinks: {
          github: 'https://github.com/kirisauce',
          wechat: 'https://space.bilibili.com/12345678',
          mail: 'https://twitter.com/',
        },
      },
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
