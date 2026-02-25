import { icon, iconFailible, MdPlugins as Plugins } from '.'
import Icons from 'unplugin-icons/vite'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import MarkdownIt from 'markdown-it'
import type { UserConfig } from 'vitepress'
import { ThemeConfig } from '../shared'
import { buildEnd } from './build-hooks'
import { ExternalSite } from '../shared/theme-config'

const BUILTIN_LICENSES = {
  'cc-by-nc-4.0': {
    family: 'creative-commons',
    name: 'CC-BY-NC-4.0',
    footerDescription: `本文章除代码部分外使用CC-BY-NC-4.0协议授权。在非商业用途下可自由转载、引用，但请务必署名作者并注明出处。`,
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
  },

  // TODO: Add all licenses of Creative Commons.
}

const getExternalSites = async (): Promise<Record<string, ExternalSite>> => ({
  default: {
    display: 'icon',
    icon: await icon('mdi:link'),
    displayName: 'Some Site',
  },

  github: {
    display: 'icon',
    icon: await icon('mingcute:github-line'),
    displayName: 'GitHub',
  },

  bilibili: {
    display: 'icon',
    icon: await icon('mingcute:bilibili-line'),
    displayName: 'BiliBili',
  },

  youtube: {
    display: 'icon',
    icon: await icon('mingcute:youtube-line'),
    displayName: 'YouTube',
  },

  twitter: {
    display: 'icon',
    icon: await icon('mingcute:twitter-line'),
    displayName: 'Twitter',
  },

  discord: {
    display: 'icon',
    icon: await icon('mingcute:discord-line'),
    displayName: 'Discord',
  },

  qq: {
    display: 'icon',
    icon: await icon('mingcute:qq-line'),
    displayName: 'QQ',
  },

  wechat: {
    display: 'icon',
    icon: await icon('mingcute:wechat-line'),
    displayName: 'WeChat',
  },

  weibo: {
    display: 'icon',
    icon: await icon('mingcute:weibo-line'),
    displayName: 'Weibo',
  },

  x: {
    display: 'icon',
    icon: await icon('mingcute:social-x-line'),
    displayName: 'X',
  },

  tiktok: {
    display: 'icon',
    icon: await icon('mingcute:tiktok-line'),
    displayName: 'TikTok',
  },

  douyin: {
    display: 'icon',
    icon: await icon('mingcute:tiktok-line'),
    displayName: 'Douyin',
  },

  mail: {
    display: 'icon',
    icon: await icon('mingcute:mail-line'),
    displayName: 'Mail',
  },
})

const getThemeConfig = async (): Promise<ThemeConfig> => ({
  license: {
    licenses: BUILTIN_LICENSES,
    families: {
      'creative-commons': {
        logo: await iconFailible('mdi:creative-commons'),
      },
    },
  },

  externalSites: await getExternalSites(),

  page: {
    home: {
      secondaryTitle: 'description',
      showImagePlaceholder: true,
    },
  },

  layout: {
    footer: {
      // 默认使用全局配置的作者下的链接
      links: 'author',

      // 版权信息 - 使用当前年份
      copyright: '[Copyright NOT CONFIGURED] © {currentYear}',

      // 默认显示许可证信息
      showLicense: true,
    },

    navigator: {
      siteIcon: await iconFailible('mdi:home'),
      siteText: 'A Vitepress Site',
    },
  },

  build: {
    maxItemsPerIndexPage: 100,
  },
})

export const getDefaultConfig = async (): Promise<UserConfig<ThemeConfig>> => {
  return {
    lang: 'zh-CN',

    vite: {
      plugins: [
        Icons({
          compiler: 'vue3',
          scale: 1.0,
        }),

        ReactivityTransform(),
      ],
    },

    markdown: {
      async preConfig(mdAsync) {
        const md = mdAsync as MarkdownIt
        Plugins.pluginPatchPreEarly(md)
      },

      async config(mdAsync) {
        const md = mdAsync as MarkdownIt
        await Plugins.pluginPatchContainer(md)
        await Plugins.pluginPatchGithubAlerts(md)
        await Plugins.pluginPatchPreLate(md)
      },

      codeCopyButtonTitle: "复制代码",
      languageLabel: {
        '': 'Code',

        'md': 'Markdown',
        'js': 'Javascript',
        'ts': 'Typescript',
        'html': 'HTML',
        'css': 'CSS',

        'rs': 'Rust',
        'c': 'C',
        'cpp': 'C++',
        'cxx': 'C++',
        'cc': 'C++',
      },
    },

    buildEnd,

    themeConfig: await getThemeConfig(),
  }
}