/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-restricted-imports */

/**
 * @Author likan
 * @Date 2022/8/13 09:03:56
 * @Filepath likan/src/types/global.d.ts
 */

declare global {
  export * as vscode from 'vscode';
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};
