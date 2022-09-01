/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @FilePath D:\CodeSpace\Dev\likan\src\constants\index.ts
 */

export const JAVASCRIPT_PATH = /["'`]((\w:[/\\])|[@~])?[\w./\\\u4E00-\u9FA5-]+["'`]/;

export const LINKED_EDITING_PATTERN = /(-?\d*\.\d\w*)|([^\s!"#%&'()*+,/:;<=>?@[\\\]^`{|}~]+)/g;

export const JAVASCRIPT_WARD_PATTERN =
  /(["'`]((\w(:[/\\]))|[@~])?([\w./\\\u4E00-\u9FA5-]+["'`]))|(-?\d*\.\d\w*)|([^\s!"#%&'()*+,./:;<=>?@[\\\]^`{|}~-]+)/;

export const JSON_PATH = /^[\w./@\\-]+$/;

export const JSON_WORD_PATTERN =
  /("((@?[\w.-]+[/\\])?[\w.-]*)")|(-?\d*\.\d\w*)|([^\s!"#%&'()*+,./:;<=>?@[\\\]^`{|}~-]+)/;

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

export const DEFAULT_ADD_EXT = ['.js', '.ts', '.jsx', '.tsx'];

export const DEFAULT_HTML_TAG = 'div';

export const LANGUAGES = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];

export const NPM_MANAGER_MAP: Record<Config['manager'], string> = {
  npm: 'npm run',
  pnpm: 'pnpm run',
  yarn: 'yarn run',
};

export const DEFAULT_ALIAS_MAP: Config['alias'] = {
  '@': '${root}/src',
  '~': '${root}',
};

export const DEFAULT_CONFIGS: DefaultConfig = {
  alias: ['list.alias', DEFAULT_ALIAS_MAP],
  author: ['string.author', 'likan'],
  exts: ['list.exts', DEFAULT_ADD_EXT],
  fileSize: ['show.fileSize', TRUE],
  filterFolders: ['list.filterFolders', ['node_modules', '.vscode', '.git']],
  folders: ['list.folders', []],
  manager: ['enum.manager', 'npm'],
  memory: ['show.memory', TRUE],
  tag: ['string.tag', DEFAULT_HTML_TAG],
  terminal: ['show.terminal', TRUE],
};
