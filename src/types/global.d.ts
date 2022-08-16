/**
 * @Author likan
 * @Date 2022/8/13 09:03:56
 * @FilePath D:\CodeSpace\Dev\likan\src\types\global.d.ts
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }

  const vscode: typeof import('vscode');
}

export {};
