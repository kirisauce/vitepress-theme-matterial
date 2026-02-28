import { icon } from './icon-helper'
import MarkdownIt from 'markdown-it'
import { RenderRule } from 'markdown-it/lib/renderer.mjs'
import { UserConfig } from 'vitepress'
import { ThemeConfig } from '../shared'

declare const VITEPRESS_CONFIG: { userConfig: UserConfig<ThemeConfig> }
const getConfig = () => VITEPRESS_CONFIG.userConfig?.themeConfig?.markdown

type PatchInfo = Record<string, {
  // klass: string,
  icon: string,
}>

const patchRenderRule = (md: MarkdownIt, ruleName: string, makePatcher: (renderOriginal: RenderRule | undefined) => RenderRule) => {
  const renderOriginal = md.renderer.rules[ruleName]
  md.renderer.rules[ruleName] = makePatcher(renderOriginal)
}

const getContainerPatchmap = async (): Promise<PatchInfo> => {
  return {
    info: {
      // klass: 'm3-outline-variant',
      icon: await icon('mdi:information-circle-outline'),
    },
    tip: {
      // klass: 'm3-outline-variant',
      icon: await icon('mdi:information-slab-circle-outline'),
    },
    warning: {
      // klass: 'm3-outline',
      icon: await icon('mdi:alert-outline'),
    },
    danger: {
      // klass: 'm3-outline',
      icon: await icon('mdi:warning-octagon-outline'),
    },
    details: {
      // klass: 'm3-outline-variant',
      icon: await icon('mdi:more-circle-outline'),
    },
  }
}

export const pluginPatchContainer = async (md: MarkdownIt) => {
  // from markdown-it-container plugin
  for (const [containerName, patchinfo] of Object.entries(await getContainerPatchmap())) {
    patchRenderRule(md, `container_${containerName}_open`, (renderOriginal) => (...args) => {
      const [tokens, idx] = args
      const token = tokens[idx]
      const tokenBackup = Object.assign({}, token)

      // Do modifications to the token
      const originalTitle = token.info.trim().substring(containerName.length).trim() || containerName.toUpperCase()
      // token.attrJoin('class', patchinfo.klass)
      token.info = ` ${containerName} <span class="svg-container">${patchinfo.icon}</span> ${originalTitle}`

      // And get the render result
      const result = renderOriginal!(...args)

      // Restore unmodified token
      Object.assign(token, tokenBackup)

      return result
    })
  }
}

const getGithubAlertPatchmap = async (): Promise<PatchInfo> => {
  return {
    note: {
      // klass: 'm3-outline-variant',
      icon: await icon('mdi:information-circle-outline'),
    },
    tip: {
      // klass: 'm3-outline-variant',
      icon: await icon('mdi:information-slab-circle-outline'),
    },
    important: {
      // klass: 'm3-outline',
      icon: await icon('mdi:warning-circle-outline'),
    },
    warning: {
      // klass: 'm3-outline',
      icon: await icon('mdi:alert-outline'),
    },
    caution: {
      // klass: 'm3-outline',
      icon: await icon('mdi:warning-octagon-outline'),
    },
  }
}

export const pluginPatchGithubAlerts = async (md: MarkdownIt) => {
  // from github-alerts plugin
  const patchmap = await getGithubAlertPatchmap()
  patchRenderRule(md, 'github_alert_open', (renderOriginal) => (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const [_, patchinfo] = Object.entries(patchmap).find(entry => entry[0] === token.meta.type) ?? []
    if (!patchinfo) {
      return renderOriginal!(...args)
    }

    const tokenBackup = Object.assign({}, token)

    // token.meta.type = `${patchinfo.klass} ${token.meta.type}`
    token.meta.title = `<span class='svg-container'>${patchinfo.icon}</span>${token.meta.title}`

    const result = renderOriginal!(...args)

    tokens[idx] = tokenBackup

    return result
  })
}

export const pluginPatchPreEarly = (md: MarkdownIt) => {
  patchRenderRule(md, 'fence', (renderOriginal) => (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const totalLines = token.content.match(/\n/g)?.length ?? 0
    const originalHtml = renderOriginal!(...args)
    let lineNumberHtml = ''

    for (let line = 1; line <= totalLines; line++) {
      lineNumberHtml += `<div>${line}</div>`
    }
    // console.log('----------')
    // console.log(tokens)

    return `
      <div class="pre-wrapper">
        <div class="line-number-list vp-copy-ignore">
          ${lineNumberHtml}
        </div>
        ${originalHtml}
      </div>
      <div class="bkgr-decoration"></div>
    `
  })
}

export const pluginPatchPreLate = async (md: MarkdownIt) => {
  const copyIcon = await icon('mdi:content-copy')
  patchRenderRule(md, 'fence', (renderOriginal) => (...args) => {
    const originalHtml = renderOriginal!(...args)
    const matchResult = /<button title="[^"]+"[^>]*>/.exec(originalHtml)
    if (!matchResult) {
      throw Error(`pluginPatchPreLate failed: button tag not found in the following part:\n${originalHtml}`)
    }

    const indexInsert = matchResult.index + matchResult[0].length
    const part1 = originalHtml.substring(0, indexInsert)
    const part2 = originalHtml.substring(indexInsert)
    const patchedHtml = `${part1}${copyIcon}${part2}`

    // console.log('----------')
    // console.log(patchedHtml)

    return patchedHtml
  })
}

export const pluginPatchImg = async (md: MarkdownIt) => {
  patchRenderRule(md, 'image', (renderOriginal) => (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const originalHtml = renderOriginal!(...args)
    const titleHtml = token.attrGet('title') ? `<span style='display:block'>${token.attrGet('title')}</span>` : ''

    return `${originalHtml}${titleHtml}`
  })
}

export const pluginPatchBlockquote = async (md: MarkdownIt) => {
  patchRenderRule(md, 'blockquote_open', (renderOriginal) => (...args) => {
    const originalHtml = renderOriginal?.(...args) ?? '<blockquote>'
    const config = getConfig()?.blockquote
    console.log(config)
    if (!config?.icon) {
      return originalHtml
    }
    return `${originalHtml}<span class='svg-container quote-icon'>${config.icon}</span>`
  })
}