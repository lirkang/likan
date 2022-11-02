/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-restricted-imports */

/**
 * @Author likan
 * @Date 2022/8/13 09:03:56
 * @Filepath likan/src/types/global.d.ts
 */

import nodeFetch from 'node-fetch';

import { CONFIG } from '@/common/constants';

declare global {
  export * as vscode from 'vscode';
  export declare const fetch: typeof nodeFetch;
  export declare const Configuration: { [K in keyof typeof CONFIG]: Any };
}

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare type Any = any;

  declare interface JSON {
    parse(byte: Uint8Array | Buffer): Any;
  }

  type Writeable<T extends Record<keyof Any, unknown>> = { -readonly [K in keyof T]: T[K] };

  type ConfigKey = keyof typeof CONFIG;

  type FileSizeUpdaterParameters = [uri?: vscode.Uri | vscode.TextDocument, condition?: boolean];
}

export { };
