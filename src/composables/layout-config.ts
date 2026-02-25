import { computed, inject, InjectionKey, provide, Ref } from "vue"
import { LayoutConfig } from "../shared/theme-config"
import { mergeConfig, useData, UserConfig } from "vitepress"
import { ThemeConfig } from "../shared"
import { mergeObjectRecursive } from "../shared/utils"

const KEY_LAYOUT_CONFIG_LAYER = Symbol('LayoutConfig') as InjectionKey<LayoutConfig>

/**
 * 直接提供一个Layout配置层。
 * @param config 具体的Layout配置
 */
export function provideLayoutConfigLayer(config: LayoutConfig | undefined): void;

/**
 * 从VitePress主题配置的`theme.page.${pageLayoutName}`.layout提取Layout配置层并应用。
 * @param pageLayoutName 作用如上
 */
export function provideLayoutConfigLayer(pageLayoutName: string): void;

export function provideLayoutConfigLayer(config: any) {
  if (typeof config === 'string') {
    config = useData().theme.value.page[config as string]?.layout
  }
  if (config !== undefined) {
    provide(KEY_LAYOUT_CONFIG_LAYER, config)
  } else {
    provide(KEY_LAYOUT_CONFIG_LAYER, {})
  }
}

export const injectLayoutConfigLayer: () => LayoutConfig | undefined = () => inject(KEY_LAYOUT_CONFIG_LAYER)

export const useLayoutConfig = (): Readonly<Ref<LayoutConfig>> => {
  const { theme } = useData<ThemeConfig>()

  return computed(() => mergeObjectRecursive(theme.value.layout, injectLayoutConfigLayer() ?? {}))
}