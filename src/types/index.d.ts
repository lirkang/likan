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

  type Commands = Array<[string, (...arguments_: Any) => Any]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Any = any;
}
