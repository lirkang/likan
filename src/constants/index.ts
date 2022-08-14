/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @FilePath D:\CodeSpace\Dev\likan\src\constants\index.ts
 */

import { Position } from 'vscode';

export const JAVASCRIPT_REGEXP = /[\"\'\`]((\w\:[\/\\])|(\@))?[\-\.\\\/\_\w\d\u4e00-\u9fa5]+[\"\'\`]/;

export const JSON_REGEXP = /"((\@?[\.\-\_\d\w]+[\\\/])?[\.\-\_\d\w]*)"/;

export const DEFAULT_EXT = ['.js', '.ts', '.jsx', '.tsx'];

export const DEFAULT_TAG = ['div', 'span', 'template'];

export const PACKAGE_JSON = 'package.json';

export const NODE_MODULES = 'node_modules';

export const EMPTY_STRING = '';

export const EMPTY_ARRAY: Array<any> = [];

export const ENV_FILES = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.development.local',
  '.env.production.local',
];

export const NPM_MANAGER_MAP: Record<Config['manager'], string> = {
  npm: 'npm run',
  pnpm: 'pnpm run',
  yarn: 'yarn run',
};

export const POSITION = new Position(0, 0);

export const QUOTES = ["'", '"', '`'];
