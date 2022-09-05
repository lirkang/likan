/* eslint-disable no-restricted-imports */
/**
 * @Author likan
 * @Date 2022/8/13 09:03:56
 * @FilePath D:\CodeSpace\Dev\likan\src\types\global.d.ts
 */

declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }

  export * as child_process from 'child_process';
  export * as fs from 'fs';
  export * as os from 'os';
  export * as path from 'path';
  export * as util from 'util';
  export * as vscode from 'vscode';
}

export {};
