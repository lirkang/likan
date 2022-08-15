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
  terminal: boolean;
  exts: Array<string>;
}

type Align = 'left' | 'right';

type Data = Record<'key' | 'value' | 'path', string>;

type Commands = Array<[`likan.${string}.${string}`, (...args: Any) => void]>;

type Any = any;
