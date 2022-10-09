/**
 * @Author likan
 * @Date 2022/8/12 19:26:38
 * @Filepath likan/src/types/index.d.ts
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

interface RequestOptions {
  data?: Any;
  headers?: Record<string, Any>;
  params?: Record<string, Any>;
  url?: string;
}

interface UnequalObject {
  keys: Record<string, undefined>;
  rangeAndText: [range: Array<vscode.Range>, transformedText: Array<string>];
}
