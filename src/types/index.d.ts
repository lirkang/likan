/**
 * @Author likan
 * @Date 2022/8/12 19:26:38
 * @Filepath src/types/index.d.ts
 */

interface ScriptsTreeItem {
  fsPath: string;
  label?: string;
  script?: string;
}

type Commands = Array<[string, (...arguments_: Any) => Any, ('registerTextEditorCommand' | 'registerCommand')?]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

interface Options {
  data?: Any;
  headers?: Record<string, Any>;
  params?: Record<string, Any>;
  url?: string;
}
