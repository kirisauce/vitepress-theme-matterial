import { iconNoThrow, MdPlugins as Plugins } from '.'
import Icons from 'unplugin-icons/vite'
import MarkdownIt from 'markdown-it'
import type { UserConfig } from 'vitepress'
import { ThemeConfig } from '../shared'

const BUILTIN_LICENSES = {
  'cc-by-nc-4.0': {
    family: 'creative-commons',
    name: 'CC-BY-NC-4.0',
    footerDescription: `本作品使用CC-BY-NC-4.0协议授权。`,
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
  },

  // TODO: Add all licenses of Creative Commons.
}

const getThemeConfig = async (): Promise<ThemeConfig> => ({
  navigator: {
    siteIcon: await iconNoThrow('mdi:home'),
    siteText: 'A Vitepress Site',
  },

  license: {
    licenses: BUILTIN_LICENSES,
    families: {
      'creative-commons':  {
        logo: await iconNoThrow('mdi:creative-commons'),
      },
    },
  },
})

export const getDefaultConfig = async (): Promise<UserConfig<ThemeConfig>> => {
  return {
    vite: {
      plugins: [
        Icons({
          compiler: 'vue3',
          scale: 1.0,
        }),
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

    themeConfig: await getThemeConfig(),
  }
}