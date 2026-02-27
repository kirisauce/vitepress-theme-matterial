import { ButtonConfig, Icon } from "./other";

// 背景图行为模式
export type HeaderImageBehavior = 'fullscreen' | 'static' | 'parallax' | 'half-parallax'

// 背景图配置
export interface HeaderImageConfig {
  /**
   * 背景图片的URL
   */
  src?: string;
  
  /**
   * 背景图的行为模式
   * - fullscreen: 全屏背景图，不占用布局空间
   * - static: 在最上方完整显示的背景图，占用布局空间，可以随页面滚动而消失
   * - parallax: 在最上方完整显示的背景图，占用布局空间，可以随页面滚动而消失，
   *            但是自身也会随着页面整体滚动而向下移动，形成差速滚动的效果
   * - half-parallax: 同parallax，但是占用50%视图高度，而不是100%视图高度
   */
  behavior?: HeaderImageBehavior;

  /**
   * 在背景图片中央显示的标题HTML文本
   * ## 支持的占位符
   *  - {site_name} 配置中的站点名称
   *  - {site_desc} 配置中的站点描述
   */
  title?: string,

  /**
   * 在背景图片中央主标题下方显示的HTML文本
   * ## 支持的占位符
   *  - {site_name} 配置中的站点名称
   *  - {site_desc} 配置中的站点描述
   */
  subtitle?: string,
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

  /** 主题信息的HTML文本 */
  themeInfo?: string,

  /** 显示在页脚的额外HTML文本 */
  extra?: string,
}

export interface NavButtonConfig {
  icon?: Icon,
  text?: string,
  href?: string,
}

export interface NavigatorConfig {
  homeButton?: NavButtonConfig,
  archiveButton?: NavButtonConfig,
  menuButton?: ButtonConfig,
}

export interface LayoutConfig {
  footer?: FooterConfig,
  navigator?: NavigatorConfig,
  headerImage?: HeaderImageConfig,
  background?: string,
}