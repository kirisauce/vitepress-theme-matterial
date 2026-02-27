export type Icon = string

export type ExternalSiteIconDisplay = "icon" | "name" | "iconAndName"

/** 外部网站信息。 */
export interface ExternalSite {
  /** 显示图标或者网站名称。 */
  display?: ExternalSiteIconDisplay,

  /** 网站图标。 */
  icon?: Icon,

  /** 网站显示名称。 */
  displayName?: string,
}

export interface ButtonConfig {
  icon?: Icon,
  text?: string,
}