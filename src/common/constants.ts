/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @Filepath likan/src/common/constants.ts
 */

export const JAVASCRIPT_PATH = /(?<quote>["'`]).+?(?<!\\)\k<quote>/;

export const LANGUAGES = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];

export enum Config {
  ALIAS = 'likan.list.alias',
  AUTHOR = 'likan.string.author',
  COMMENT = 'likan.show.comment',
  DESCRIPTION = 'likan.show.description',
  EXPLORER = 'likan.show.explorer',
  EXTS = 'likan.list.exts',
  FILE_SIZE = 'likan.show.fileSize',
  FILTER_FOLDERS = 'likan.list.filterFolders',
  FOLDERS = 'likan.list.folders',
  MEMORY = 'likan.show.memory',
  TAG = 'likan.string.tag',
}
