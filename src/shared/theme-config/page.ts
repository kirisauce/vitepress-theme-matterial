import { LayoutConfig } from "./layout";

export interface WithLayoutConfigLayer {
  layout?: LayoutConfig,
}

/**
 * 家是本配置（？
 */
export interface HomeConfig extends WithLayoutConfigLayer {
  /**
   * 首页的副标题显示文本的来源。
   *
   * ## Possible Values
   *  - "none": 不显示副标题。
   *  - "description": 显示站点描述。（默认）
   *  - "custom": 显示自定义副标题。（需要设置`secondaryTitleText`）
   */
  secondaryTitle?: "none" | "description" | "custom",

  /**
   * 自定义的副标题。
   */
  secondaryTitleText?: string,

  /**
   * 当文章没有封面图时，是否显示占位区域。
   * 默认为 true。
   */
  showImagePlaceholder?: boolean,

  /**
   * 首页文章卡片显示的时间来源。
   * 默认为 "modified"（更新时间）
   *
   * ## Possible Values
   *  - "created": 显示创建时间
   *  - "modified": 显示更新时间
   */
  cardTimeSource?: 'created' | 'modified',
}

export interface PostConfig extends WithLayoutConfigLayer {}

export interface ArchiveConfig extends WithLayoutConfigLayer {}

export interface PageConfig {
  home?: HomeConfig,
  post?: PostConfig,
  archive?: ArchiveConfig,
}