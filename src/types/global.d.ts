/* eslint-disable no-restricted-imports */
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

  export * as fs from 'fs';
  export * as path from 'path';
  export * as vscode from 'vscode';
  export * as vscode from 'vscode';
}

export {};
