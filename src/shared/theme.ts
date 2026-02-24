export type Icon = string

export interface AuthorInfo {
  /** URL that points to avatar for the author. */
  avatar?: string,

  /** Author's bio/description */
  bio?: string,

  /** Author's external links */
  externalLinks?: Record<string, string>,
}

export interface License {
  /**
   * License name.
   */
  name: string,

  /**
   * Description of this license.
   */
  footerDescription: string,

  /**
   * URL to the legalcode of this license.
   */
  url: string,

  /**
   * License family.
   * This property affects the used icon.
   */
  family?: string,
}

export interface LicenseFamily {
  logo?: Icon,
}

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

/** 主题构建钩子的配置 */
export interface BuildConfig {
  /** 配置一个索引页文件内最多包含几个item。默认值100 */
  maxItemsPerIndexPage?: number,
}

export interface ThemeConfig {
  /** Default author for posts that do not have any author specified. */
  author?: string,

  /**
   * Profile for authors.
   */
  authorProfiles?: { [s: string]: AuthorInfo },

  navigator?: {
    /**
     * Text to be shown as the site's name on the navigator.
     * If this value is omitted, configured site-level name would be used instead.
    */
    siteText?: string,

    /**
     * Icon to be shown as the site's icon on the navigator.
     * 
     * Example:
     *  - `icon("mdi:github") // 'icon' is from '/node'`
     *  - `"/site-icon.png"`
     */
    siteIcon?: Icon,
  },

  /**
   * License-related configuration.
   */
  license?: {
    /**
     * Default license applied to every posts.
     * 
     * ## Example Values
     *  - "cc-by-4.0"
     */
    default?: string,

    /**
     * Available licenses.
     */
    licenses?: Record<string, License>,

    /**
     * License families.
     */
    families?: Record<string, LicenseFamily>,
  },

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

  /**
   * Layout相关配置。
   */
  layout?: {
    /**
     * 家是本配置（？
     */
    home?: {
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

    },

    /**
     * 页脚配置。
     */
    footer?: FooterConfig,
  },

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