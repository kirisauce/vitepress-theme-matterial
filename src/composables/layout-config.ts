import { computed, inject, InjectionKey, MaybeRef, provide, ref, Ref, unref } from "vue"
import { LayoutConfig } from "../shared/theme-config"
import { useData } from "vitepress"
import { ThemeConfig } from "../shared"
import { mergeObjectRecursive } from "../shared/utils"

const KEY_LAYOUT_CONFIG_LAYER = Symbol('LayoutConfig') as InjectionKey<Ref<LayoutConfig>>

/**
 * 直接提供一个Layout配置层。
 * @param config 具体的Layout配置
 */
export function provideLayoutConfigLayer(config: MaybeRef<LayoutConfig> | undefined): void;

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
    provide(KEY_LAYOUT_CONFIG_LAYER, ref({}))
  }
}

export const injectLayoutConfigLayer: () => MaybeRef<LayoutConfig> | undefined = () => inject(KEY_LAYOUT_CONFIG_LAYER)

export const useLayoutConfig = (obviousLayer?: MaybeRef<LayoutConfig>): Readonly<Ref<LayoutConfig>> => {
  const { theme } = useData<ThemeConfig>()

  if (obviousLayer === undefined) {
    return computed(() => mergeObjectRecursive(unref(theme).layout, unref(injectLayoutConfigLayer()) ?? {}))
  } else {
    return computed(() => mergeObjectRecursive(unref(theme).layout, unref(obviousLayer)))
  }
}