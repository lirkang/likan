/**
 * @Author likan
 * @Date 2022/8/13 09:03:56
 * @Filepath likan/src/types/global.d.ts
 */

import nodeFetch from 'node-fetch';

import { Config } from '@/common/constants';

declare global {
  /* eslint-disable no-restricted-imports */
  export * as vscode from 'vscode';
  export const fetch: typeof nodeFetch;
  export const Configuration: { [K in ConfigKey]: Any };
}

declare global {
  namespace NodeJS {
    /* eslint-disable unicorn/prevent-abbreviations */
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Any = any;

  interface JSON {
    parse(byte: Uint8Array | Buffer): Any;
  }

  type Writeable<T extends Record<PropertyKey, unknown>> = { -readonly [K in keyof T]: T[K] };

  type ConfigKey = keyof typeof Config;

  type FileSizeUpdater = [uri?: vscode.Uri | vscode.TextDocument, condition?: boolean];

  interface TagWrapHandler {
    (textEditor: vscode.TextEditor, editor: Editor, tabSize: string): [vscode.Position, vscode.Position];
  }
}

export { };
