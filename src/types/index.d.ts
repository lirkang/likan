/**
 * @Author likan
 * @Date 2022/8/12 19:26:38
 * @FilePath D:\CodeSpace\Dev\likan\src\types\index.d.ts
 */

interface Config {
  alias: Record<string, string>;
  author: string;
  exts: Array<string>;
  fileSize: boolean;
  filterFolders: Array<string>;
  folders: Array<string>;
  manager: 'npm' | 'yarn' | 'pnpm';
  memory: boolean;
  tag: string;
  terminal: boolean;
}

interface ScriptsTreeItem {
  first?: boolean;
  fsPath: string;
  label?: string;
  script?: string;
}

type Align = 'left' | 'right';

type Data = Record<'key' | 'value' | 'path', string>;

type Commands = Array<[`likan.${'language' | 'open' | 'other'}.${string}`, (...arguments_: Any) => void]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type DefaultConfig = { [K in keyof Config]: [`${ConfigType}.${K}`, Config[K]] };

type ConfigType = 'show' | 'string' | 'list' | 'enum';

type ValueOf<T> = T[keyof T];

interface TreeItem {
  dirname: string;
  first?: boolean;
  fsPath: string;
  type: 'file' | 'folder';
}
