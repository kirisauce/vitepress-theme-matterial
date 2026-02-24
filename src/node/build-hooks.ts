import path from 'node:path'
import fsPromises from 'node:fs/promises'
import { SiteConfig } from 'vitepress'
import { ThemeConfig } from '../shared'
import { loadPostData } from './post-data-loader'
import { IndexItem } from '../shared/index-types'

const FS_FLAGS: { encoding: 'utf-8' } = { encoding: 'utf-8' }

const extractIndexItems = async (outDir: string, assetsDir: string, srcDir: string, webBase: string, pages: string[]) => {
  // 读取hashmap.json，用于后面寻找页面对应的js文件
  const hashmap: Record<string, string> = JSON.parse(await fsPromises.readFile(path.resolve(outDir, 'hashmap.json'), FS_FLAGS))
  const pageDataMatcher = /JSON\.parse\(\s*(['"])([^\\]*(?:\\.[^\\]*)*)\1\s*\)/

  let items = new Array<IndexItem>()

  // 遍历页面
  for (const pagePath of pages) {
    const normalizedPagePath = pagePath.replaceAll('/', '_')
    const pageHash = hashmap[normalizedPagePath]

    // 找到存放PageData的js文件，读取代码
    const jsPath = path.resolve(assetsDir, `${normalizedPagePath}.${pageHash}.js`)
    const codeText = await fsPromises.readFile(jsPath, FS_FLAGS)

    // 然后把PageData抠出来
    const pageDataText = pageDataMatcher.exec(codeText)?.[2]
    if (!pageDataText) {
      throw Error(`Extracting page data from "${pagePath}" failed`)
    }
    const pageData = JSON.parse(pageDataText)

    // console.log(`${normalizedPagePath}\n`, pageData)

    const title = pageData.title || path.basename(pagePath)
    const relativeWebPath = (pageData.relativePath as string).replace(/\.md$/, '.html')

    const postData = await loadPostData(path.resolve(srcDir, pageData.relativePath))

    items.push({
      title,
      path: (new URL(relativeWebPath, (new URL(webBase, 'https://example.com')).href)).pathname,
      timeCreated: postData.timeCreated,
    })
  }

  return items
}

const saveIndexItems = async (dir: string, maxItemsPerIndexPage: number, items: IndexItem[]) => {
  // 创建文件夹用来存放index
  await fsPromises.mkdir(dir, { recursive: true })

  // 把索引分文件写入
  let chunkNumber = 0
  let sliceBegin = maxItemsPerIndexPage * chunkNumber
  while (sliceBegin < items.length) {
    const itemsToWrite = items.slice(sliceBegin, Math.min(items.length, sliceBegin + maxItemsPerIndexPage))
    let output = {
      items: itemsToWrite,
      maxItems: maxItemsPerIndexPage,
      numTotalItems: items.length,
    }

    fsPromises.writeFile(path.resolve(dir, `${chunkNumber}.json`), JSON.stringify(output))

    chunkNumber++
    sliceBegin = maxItemsPerIndexPage * chunkNumber
  }

  return chunkNumber
}

export const buildEnd = async (siteConfig: SiteConfig<ThemeConfig>) => {
  const {
    outDir,
    srcDir,
    logger,
    pages,
    site,
    userConfig: {
      themeConfig,
    },
    assetsDir: relAssetsDir,
  } = siteConfig
  const info = (msg: string) => logger.info(`[matterial] buildEnd hook: ${msg}`)
  info('Begin')
  // console.log(siteConfig)

  const themeDir = path.resolve(outDir, 'matterial')
  const assetsDir = path.resolve(outDir, relAssetsDir)
  const indexDir = path.resolve(themeDir, 'archive-indexfiles')

  const items = await extractIndexItems(outDir, assetsDir, srcDir, site.base, pages)
  info(`Indexed ${items.length} items`)
  // console.log(items)

  const numPages = await saveIndexItems(indexDir, themeConfig?.build?.maxItemsPerIndexPage!, items)
  info(`Saved ${numPages} index pages, max ${themeConfig?.build?.maxItemsPerIndexPage} items per page`)

  info('End')
}