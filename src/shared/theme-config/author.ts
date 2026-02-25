export interface AuthorInfo {
  /** URL that points to avatar for the author. */
  avatar?: string,

  /** Author's bio/description */
  bio?: string,

  /** Author's external links */
  externalLinks?: Record<string, string>,
}