import asyncFs from 'node:fs/promises'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { UserConfig } from 'vitepress'
import { objectShrink } from '../shared/utils'
import { PostData } from '../shared'

const md = new MarkdownIt({
  html: false,
})

const LAYOUTS_NO_INDEX = [
  'index',
  'home',
  'archive',
]

declare const VITEPRESS_CONFIG: UserConfig | undefined

export const getBaseDirectory = () => {
  const config = VITEPRESS_CONFIG!
  if (!config) {
    throw Error("content loader invoked without an active vitepress process, or before vitepress config is resolved.")
  }
  return config.srcDir!
}

interface MarkdownData {
  title: string | undefined,
  excerpt: string | undefined,
}

export const extractMarkdownData = (mdContent: string): MarkdownData => {
  const excerptLength = 150
  let title: string | undefined = undefined
  let excerpt: string | undefined = undefined
  let headings = []
  let tokens = md.parse(mdContent, {})

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.type === 'heading_open') {
      const level = Number(token.tag.slice(1))

      const contentToken = tokens[i + 1]
      if (contentToken?.type === 'inline') {
        const headingText = contentToken.content.trim()
        headings.push({ level, text: headingText })

        if (level === 1 && title === undefined) {
          title = headingText
        }
      }
    }

    if (!excerpt && token.type === 'paragraph_open') {
      const contentToken = tokens[i + 1]
      if (contentToken?.type === 'inline') {
        let pureText = md.render(contentToken.content)
          .replace(/\<\/?[\w\-_\.]*\>/g, '') // Remove HTML tags
          .trim()

        excerpt = pureText.length > excerptLength
          ? pureText.slice(0, excerptLength) + '...'
          : pureText
      }
    }
  }

  if (title === undefined) {
    title = headings.reduce(
      (prev, next) => next.level < prev.level ? next : prev,
      { level: 114514, text: undefined as (string | undefined) },
    ).text
  }

  return objectShrink({
    title,
    excerpt,
  })
}

export const checkPostFrontMatterNoIndex = (frontMatter: any) => {
  if (typeof frontMatter.noIndex == 'boolean') {
    return frontMatter.noIndex
  }
  if (LAYOUTS_NO_INDEX.includes(frontMatter.layout)) {
    return true
  }
  return false
}

export const getPageLink = (prefix: string, path: string) => {
  if (path.startsWith(prefix)) {
    return path.substring(prefix.length).replace(/\.md$/, '.html')
  } else {
    throw Error(`Path ${path} does not have prefix ${prefix}`)
  }
}

export const loadPostData = async (file: string, baseDirectory?: string) => {
  const { data: frontMatter, content } = await asyncFs.readFile(file).then(buf => buf.toString()).then(str => matter(str))

  const stat = await asyncFs.stat(file)
  const mdData = extractMarkdownData(content) as any

  let merged = {
    link: baseDirectory ? getPageLink(baseDirectory, file) : undefined,
    title: '',
    excerpt: '',
    tags: [],
    image: undefined,
    timeCreated: stat.birthtime,
    timeModified: stat.mtime,
    ...mdData,
    ...objectShrink(frontMatter),
  } as PostData
  merged.timeCreated = Number(merged.timeCreated)
  merged.timeModified = Number(merged.timeModified)

  return merged
}