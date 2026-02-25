export interface IndexItem {
  title: string,
  path: string,
  timeCreated: number,
}

export interface ArchiveIndexPage {
  items: IndexItem[],
  maxItems: number,
  numTotalItems: number,
}

export namespace Directory {
  export const THEME = 'matterial/'
  export const ARCHIVE_INDEX = 'archive-indexfiles/'
}

