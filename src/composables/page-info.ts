import { useData } from "vitepress"
import { computed, Ref } from "vue"
import { objectShrink } from "../utils"
import { License, LicenseFamily, ThemeConfig } from "../shared"

export interface PageInfo {
  authors: string[],
  lastUpdated: Date | undefined,
  license: License,
  licenseFamily: LicenseFamily,
}

export const usePageInfo = (): Readonly<Ref<PageInfo>> => {
  const {
    frontmatter: _frontmatter,
    page: _page,
    theme: _theme,
  } = useData<ThemeConfig>()

  const frontmatter = _frontmatter.value
  const page = _page.value
  const theme = _theme.value

  return computed(() => {
    const authors = objectShrink((frontmatter.authors ?? []).concat([theme.author]))

    let lastUpdated
    {
      const time = [frontmatter.timeModified, page.lastUpdated].find(v => v !== undefined)
      if (time !== undefined) {
        if (typeof time == 'number' || typeof time == 'string') {
          lastUpdated = new Date(time)
        } else {
          lastUpdated = time
        }
      } else {
        lastUpdated = undefined
      }
    }

    const license = theme.license.licenses[frontmatter.license ?? theme.license.default]
    const licenseFamily = license?.family ? theme.license.families[license.family] : undefined

    return {
      authors,
      lastUpdated,
      license,
      licenseFamily,
    }
  })
}