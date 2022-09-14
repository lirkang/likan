/**
 * @Author likan
 * @Date 2022/8/12 19:26:38
 * @FilePath D:\CodeSpace\Dev\likan\src\types\index.d.ts
 */

namespace Common {
  interface ScriptsTreeItem {
    fsPath: string;
    label?: string;
    script?: string;
  }

  type Commands = Array<[string, (...arguments_: Any) => Any, ('registerTextEditorCommand' | 'registerCommand')?]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Any = any;
}
