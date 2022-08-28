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
  tags: Array<string>;
  exts: Array<string>;
  alias: Record<string, string>;
  terminal: boolean;
  folders: Array<string>;
  filterFolders: Array<string>;
}

interface ScriptsTreeItem {
  fsPath: string;
  label?: string;
  script?: string;
}

type Align = 'left' | 'right';

type Data = Record<'key' | 'value' | 'path', string>;

type Commands = Array<[`likan.${'language' | 'open' | 'other'}.${string}`, (...args: Any) => void]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type DefaultConfig = { [K in keyof Config]: [`${ConfigType}.${K}`, Config[K]] };

type ConfigType = 'show' | 'string' | 'list' | 'enum';

type ValueOf<T> = T[keyof T];

interface TreeItem {
  dirname: string;
  fsPath: string;
  type: 'file' | 'folder';
  first?: boolean;
}
