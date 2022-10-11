/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-restricted-imports */

/**
 * @Author likan
 * @Date 2022/8/13 09:03:56
 * @Filepath likan/src/types/global.d.ts
 */

import { DEFAULT_CONFIGS } from '@/common/constants';

declare global {
  export * as vscode from 'vscode';
  export declare const Configuration: Config;
}

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare type Any = any;

  declare interface RequestOptions {
    data?: Any;
    headers?: Record<string, Any>;
    params?: Record<string, Any>;
    url?: string;
  }

  declare interface JSON {
    parse(byte: Uint8Array | Buffer): Any;
  }

  declare interface getConfig {
    <K extends keyof Config>(key: K, scope?: vscode.Uri): Config[K];
    (scope?: vscode.Uri): Config;
  }

  declare type Config = { [K in keyof typeof DEFAULT_CONFIGS]: typeof DEFAULT_CONFIGS[K][1] };

  declare type InferArrayGenerics<T extends Array<unknown>> = T extends Array<unknown>
    ? T extends Array<infer R>
      ? R
      : never
    : never;
}

export {};
