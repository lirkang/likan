/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @Filepath likan/src/common/constants.ts
 */

export const JAVASCRIPT_PATH = /(["'`])((\w:[/\\])|[@~])?[\w./\\\u4E00-\u9FA5-]+\1/;

export const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export const LANGUAGES = [ 'javascript', 'typescript', 'javascriptreact', 'typescriptreact' ];

export const PIC_EXTS = [
  '.bmp',
  '.jpg',
  '.jpeg',
  '.png',
  '.tif',
  '.gif',
  '.pcx',
  '.tga',
  '.exif',
  '.fpx',
  '.svg',
  '.psd',
  '.cdr',
  '.pcd',
  '.dxf',
  '.ufo',
  '.eps',
  '.ai,raw',
  '.WMF',
  '.webp',
  '.avif',
  '.apng',
];

export enum CONFIG {
  ALIAS = 'likan.list.alias',
  AUTHOR = 'likan.string.author',
  CHARACTERS = 'likan.other.changeCaseCharacter',
  CLIPBOARD_CUT = 'likan.other.clipboardCut',
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

export const CONFIG_KEYS: Array<keyof typeof CONFIG> = [
  'ALIAS',
  'AUTHOR',
  'CHARACTERS',
  'CLIPBOARD_CUT',
  'COMMENT',
  'DESCRIPTION',
  'EXPLORER',
  'EXTS',
  'FILE_SIZE',
  'FILTER_FOLDERS',
  'FOLDERS',
  'MEMORY',
  'TAG',
];
