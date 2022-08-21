/* eslint-disable no-useless-escape */
/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @FilePath D:\CodeSpace\Dev\likan\src\constants\index.ts
 */

export const JAVASCRIPT_PATH = /[\"\'\`]((\w\:[\/\\])|[\@\~]{1})?[\-\.\\\/\_\w\d\u4e00-\u9fa5]+[\"\'\`]/;

export const JSON_PATH = /"((\@?[\.\-\_\d\w]+[\\\/])?[\.\-\_\d\w]*)"/;

export const BASE_PATH_REGEXP = /[\\\/\.\d\w]+$/;

export const PACKAGE_JSON_PATH = /^[\@\.\-\_\\\/\w\d]+$/;

export const JAVASCRIPT_WARD_PATTERN =
  /([\"\'\`]((\w(\:[\/\\]))|[\@\~])?([\-\.\\\/\_\w\d\u4e00-\u9fa5]+[\"\'\`]))|(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/;

export const JSON_WORD_PATTERN =
  /(\"((\@?[\.\-\_\d\w]+[\\\/])?[\.\-\_\d\w]*)\")|(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/;

export const POSITION = new vscode.Position(0, 0);

export const PACKAGE_JSON = 'package.json';

export const NODE_MODULES = 'node_modules';

export const EMPTY_STRING = '';

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

export const DEFAULT_EXT = ['.js', '.ts', '.jsx', '.tsx', '.vue'];

export const DEFAULT_TAG = ['div', 'span', 'template'];

export const LANGUAGES = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'vue'];

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
  author: ['language.author', 'likan'],
  manager: ['npm.manager', 'npm'],
  fileSize: ['statusbar.fileSize', true],
  memory: ['statusbar.memory', true],
  htmlTag: ['language.htmlTag', DEFAULT_TAG],
  exts: ['path.exts', DEFAULT_EXT],
  alias: ['path.alias', DEFAULT_ALIAS_MAP],
};
