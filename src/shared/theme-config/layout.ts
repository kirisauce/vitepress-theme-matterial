import { Icon } from "./other";

// 背景图行为模式
export type HeaderImageBehavior = 'fullscreen' | 'static' | 'parallax'

// 背景图配置
export interface HeaderImageConfig {
  /**
   * 背景图片的URL
   */
  src: string;
  
  /**
   * 背景图的行为模式
   * - fullscreen: 全屏背景图，不占用布局空间
   * - static: 在最上方完整显示的背景图，占用布局空间，可以随页面滚动而消失
   * - parallax: 在最上方完整显示的背景图，占用布局空间，可以随页面滚动而消失，
   *            但是自身也会随着页面整体滚动而向下移动，形成差速滚动的效果
   */
  behavior?: HeaderImageBehavior;
}

/** 页脚配置。 */
export interface FooterConfig {
  /**
   * 版权信息。
   * 支持占位符：
   *  - "{currentYear}" 自动填充当前年份
   */
  copyright?: string,

  /** 外部链接列表（社交媒体等）。 */
  links?: Record<string, string> | string,

  /**
   * 是否显示许可证信息。
   * 默认为 true。
   */
  showLicense?: boolean,

  /**
   * 额外的页脚文本。
   */
  extraText?: string,
}

export interface NavButtonConfig {
  icon?: Icon,
  text?: string,
  href?: string,
}

export interface NavigatorConfig {
  homeButton?: NavButtonConfig,
  archiveButton?: NavButtonConfig,
}

export interface LayoutConfig {
  footer?: FooterConfig,
  navigator?: NavigatorConfig,
  headerImage?: HeaderImageConfig,
  background?: string,
}