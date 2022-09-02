/**
 * @Author likan
 * @Date 2022/8/12 19:26:38
 * @FilePath D:\CodeSpace\Dev\likan\src\types\index.d.ts
 */

interface ScriptsTreeItem {
  first?: boolean;
  fsPath: string;
  label?: string;
  script?: string;
}

type Align = 'left' | 'right';

type Data = Record<'key' | 'value' | 'path', string>;

type Commands = Array<[`likan.${'language' | 'open' | 'other' | 'refresh'}.${string}`, (...arguments_: Any) => void]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type ConfigType = 'show' | 'string' | 'list' | 'enum';

type ValueOf<T> = T[keyof T];

interface TreeItem {
  dirname: string;
  first?: boolean;
  fsPath: string;
  type: 'file' | 'folder';
}
