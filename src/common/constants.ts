/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @FilePath D:\CodeSpace\Dev\likan\src\constants\index.ts
 */

export const JAVASCRIPT_PATH = /["'`]((\w:[/\\])|[@~])?[\w./\\\u4E00-\u9FA5-]+["'`]/;

export const LINKED_EDITING_PATTERN = /(-?\d*\.\d\w*)|([^\s!"#%&'()*+,/:;<=>?@[\\\]^`{|}~]+)/g;

export const JAVASCRIPT_WARD_PATTERN =
  /(["'`]((\w(:[/\\]))|[@~])?([\w./\\\u4E00-\u9FA5-]+["'`]))|(-?\d*\.\d\w*)|([^\s!"#%&'()*+,./:;<=>?@[\\\]^`{|}~-]+)/;

export const JSON_PATH = /^(@?[\w\-]+\/)|([\w\-]+)$/;

export const CLOSED_TAG =
  '[\\_\\-\\w\\d]*(([\\t\\s\\n]*\\:?[\\_\\-\\w\\d]+(=?(\\".*\\"))?[\\s\\t\\n]*)|[\\s\\n\\t]*)*\\/>';

export const POSITION = new vscode.Position(0, 0);

export const PACKAGE_JSON = 'package.json';

export const NODE_MODULES = 'node_modules';

export const EMPTY_STRING = '';

export const FALSE = false;

export const TRUE = true;

export const UNDEFINED = undefined;

// eslint-disable-next-line quotes
export const QUOTES = ["'", '"', '`'];

export const ENV_FILES = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.development.local',
  '.env.production.local',
];

export const DEFAULT_AUTO_CREATE_DOC_COMMENT_EXT = ['.js', '.ts', '.jsx', '.tsx'];

export const DEFAULT_ADD_EXT = ['.js', '.ts', '.jsx', '.tsx', '.vue'];

export const LANGUAGES = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];

export const NPM_MANAGER_MAP = {
  npm: 'npm run',
  pnpm: 'pnpm run',
  yarn: 'yarn run',
};

export const DEFAULT_ALIAS_MAP = {
  '@': '${root}/src',
  '~': '${root}',
};

export const BROWSERS: Record<string, string> = {
  Chrome: 'chrome',
  Edge: 'MicrosoftEdge',
  Firefox: 'FirefoxDeveloperEdition',
  Opera: 'opera',
  Safari: 'safari',
};

export const DEFAULT_CONFIGS = {
  alias: ['list.alias', DEFAULT_ALIAS_MAP],
  author: ['string.author', 'likan'],
  exts: ['list.exts', DEFAULT_ADD_EXT],
  fileSize: ['show.fileSize', TRUE],
  filterFolders: ['list.filterFolders', ['node_modules', '.vscode', '.git', '.svn']],
  folders: ['list.folders', []],
  manager: ['enum.manager', 'npm'],
  memory: ['show.memory', TRUE],
  tag: ['string.tag', 'div'],
} as const;

export type Config = { [K in keyof typeof DEFAULT_CONFIGS]: typeof DEFAULT_CONFIGS[K][1] };
