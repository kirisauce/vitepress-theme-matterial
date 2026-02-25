import { Icon } from "./other";

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
}