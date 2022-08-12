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
}

type Align = 'left' | 'right';

type Data = Record<'key' | 'value' | 'path', string>;
