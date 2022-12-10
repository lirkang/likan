/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @Filepath likan/src/common/constants.ts
 */

export const JAVASCRIPT_PATH = /(["'`])(?:(?:\w:[/\\])|[@~])?[\w./\\\u4E00-\u9FA5-]+\1/;

export const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export const LANGUAGES = [ 'javascript', 'typescript', 'javascriptreact', 'typescriptreact' ];

export enum CONFIG {
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
