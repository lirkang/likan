/* eslint-disable no-restricted-imports */
/**
 * @Author likan
 * @Date 2022/8/13 09:03:56
 * @Filepath likan/src/types/global.d.ts
 */

declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }

  export * as vscode from 'vscode';
}

export {};
