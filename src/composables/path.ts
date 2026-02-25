import { useData } from "vitepress"
import { ThemeConfig } from "../shared"
import { computed } from "vue"
import { Directory } from "../shared/index-types"
import { joinURL } from "../shared/utils"

export interface Pathes {
  themeDir: URL,
}

export const usePathes = () => {
  const { site: _site } = useData<ThemeConfig>()

  return computed(() => {
    const site = _site.value

    return {
      themeDir: joinURL([site.base, Directory.THEME]),
    }
  })
}