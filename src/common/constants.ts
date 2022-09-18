/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @FilePath D:\CodeSpace\Dev\likan\src\constants\index.ts
 */

export const JAVASCRIPT_PATH = /(["'`])((\w:[/\\])|[@~])?[\w./\\\u4E00-\u9FA5-]+\1/;

export const LINKED_EDITING_PATTERN = /(-?\d*\.\d\w*)|([^\s!"#%&'()*+,/:;<=>?@[\\\]^`{|}~]+)/g;

export const JAVASCRIPT_WARD_PATTERN =
  /(["'`]((\w(:[/\\]))|[@~])?([\w./\\\u4E00-\u9FA5-]+["'`]))|(-?\d*\.\d\w*)|([^\s!"#%&'()*+,./:;<=>?@[\\\]^`{|}~-]+)/;

export const CLOSED_TAG =
  '[\\_\\-\\w\\d]*(([\\t\\s\\n]*\\:?[\\_\\-\\w\\d]+(=?(\\".*\\"))?[\\s\\t\\n]*)|[\\s\\n\\t]*)*\\/>';

export const POSITION = new vscode.Position(0, 0);

export const TEMPLATE_BASE_URL = 'https://api.github.com/gitignore/templates';

export const EMPTY_STRING = '';

export const VOID = void 0;

export const ENV_FILES = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.development.local',
  '.env.production.local',
];

export const LANGUAGES = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];

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

export const DEFAULT_ALIAS_MAP = {
  '@': '${root}/src',
  '~': '${root}',
};

export const DEFAULT_CONFIGS = {
  alias: ['list.alias', DEFAULT_ALIAS_MAP],
  author: ['string.author', EMPTY_STRING],
  comment: ['show.comment', true],
  exts: ['list.exts', ['.js', '.ts', '.jsx', '.tsx', '.vue']],
  fileSize: ['show.fileSize', true],
  filterFolders: ['list.filterFolders', ['node_modules', '.vscode', '.git', '.svn']],
  folders: ['list.folders', <Array<string>>[]],
  memory: ['show.memory', true],
  tag: ['string.tag', 'div'],
} as const;

export type Config = { [K in keyof typeof DEFAULT_CONFIGS]: typeof DEFAULT_CONFIGS[K][1] };
