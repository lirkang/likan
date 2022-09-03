/**
 * @Author likan
 * @Date 2022/8/12 19:26:38
 * @FilePath D:\CodeSpace\Dev\likan\src\types\index.d.ts
 */

namespace Common {
  interface ScriptsTreeItem {
    first?: boolean;
    fsPath: string;
    label?: string;
    script?: string;
  }

  interface TreeItem {
    dirname: string;
    first?: boolean;
    fsPath: string;
    type: 'file' | 'folder';
  }

  type Commands = Array<[`likan.${'language' | 'open' | 'other' | 'refresh'}.${string}`, (...arguments_: Any) => void]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Any = any;
}
