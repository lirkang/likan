/**
 * @Author likan
 * @Date 2022/8/12 19:26:38
 * @FilePath D:\CodeSpace\Dev\likan\src\types\index.d.ts
 */

interface Config {
  manager: 'npm' | 'yarn' | 'pnpm';
  author: string;
  fileSize: boolean;
  memory: boolean;
  htmlTag: Array<string>;
  exts: Array<string>;
  alias: Record<string, string>;
}

type Align = 'left' | 'right';

type Data = Record<'key' | 'value' | 'path', string>;

type Commands = Array<[`likan.${string}.${string}`, (...args: Any) => void]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type DefaultConfig = { [K in keyof Config]: [`${ConfigType}.${K}`, Config[K]] };

type ConfigType = 'language' | 'npm' | 'path' | 'statusbar' | 'other';

type ValueOf<T> = T[keyof T];
