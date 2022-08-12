/**
 * @Author likan
 * @Date 2022/8/11 21:16:04
 * @FilePath D:\CodeSpace\Dev\likan\src\constants\index.ts
 */

export const JAVASCRIPT_REGEXP = /(([a-zA-Z]\:[\/\\])|(\@))?[\-\.\\\/\_a-zA-Z0-9]+/g;

export const JSON_REGEXP = /(\@?[\.\-0-9a-zA-Z]*(\/)?[\.\-\_0-9a-zA-Z]+)/g;

export const DEFAULT_EXT = ['.js', '.ts', '.jsx', '.tsx'];

export const DEFAULT_TAG = ['div', 'span', 'template'];

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
