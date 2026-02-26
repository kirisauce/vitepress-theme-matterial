import { AuthorInfo, BuildConfig, ExternalSite, LayoutConfig, LicenseConfig, PageConfig } from './theme-config'
import { FontConfig } from './theme-config/font'

export interface ThemeConfig {
  /** Default author for posts that do not have any author specified. */
  author?: string,

  /**
   * Profile for authors.
   */
  authorProfiles?: { [s: string]: AuthorInfo },

  /**
   * 外部站点的配置。
   * Key是外部站点的标识符。特殊站点`default`表示缺失配置时的默认配置。
   * 
   * ## Example
   * ```ts
   * {
   *   default: {
   *     display: "icon",
   *     icon: "mdi:link",
   *   },
   * 
   *   mySite: {
   *     display: "name", // 显示站点名称，而不是图标。
   *     name: "My example site",
   *   },
   * }
   */
  externalSites?: Record<string, ExternalSite>,

  font?: FontConfig,
  license?: LicenseConfig,
  page?: PageConfig,
  layout?: LayoutConfig,
  build?: BuildConfig,
}

export type PostData = _PostData & Record<string, string>

// ----- Other Types -----
export interface _PostData {
  /**
   * Title of the post.
   */
  title: string,

  /**
   * The instant when the post was created.
   * 
   * This time is usually got from the frontmatter field 'timeCreated'.
   * If the field 'timeCreated' does not exists in the frontmatter, this time is known
   * from the file system.
   */
  timeCreated: number,

  /**
   * The instant when the post was last modified.
   * 
   * This time is usually got from the frontmatter field 'timeModified'.
   * If the field 'timeModified' does not exists in the frontmatter, this time is known
   * from the file system.
   */
  timeModified: number,

  /**
   * Excerpt of this post.
   */
  excerpt: string,

  /**
   * User-defined tags of the post.
   */
  tags: string[],

  /**
   * Link to the post.
   */
  link: string,

  /**
   * Link to the header image of the post.
   */
  image?: string,
}