/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @Filepath likan/src/common/constants.ts
 */

export const JAVASCRIPT_PATH = /(["'`])((\w:[/\\])|[@~])?[\w./\\\u4E00-\u9FA5-]+\1/;

export const DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss';

export const TEMPLATE_BASE_URL = 'https://api.github.com/gitignore/templates';

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
  author: ['string.author', ''],
  characters: [
    'other.changeCaseCharacter',
    {
      ' ': false,
      '-': true,
      '.': false,
      '/': false,
      _: true,
    },
  ],
  comment: ['show.comment', true],
  exts: ['list.exts', ['.js', '.ts', '.jsx', '.tsx', '.vue']],
  fileSize: ['show.fileSize', true],
  filterFolders: ['list.filterFolders', ['node_modules', '.vscode', '.git', '.svn']],
  folders: ['list.folders', <Array<string>>[]],
  memory: ['show.memory', true],
  tag: ['string.tag', 'div'],
} as const;
