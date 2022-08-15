/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { extname } from 'path';
import { workspace } from 'vscode';

import { DEFAULT_EXT } from '@/constants';
import { getDocComment } from '@/utils';

workspace.onDidCreateFiles(({ files }) => {
  files.forEach(uri => {
    const suffix = extname(uri.fsPath);

    if (DEFAULT_EXT.includes(suffix) && !readFileSync(uri.fsPath, 'utf-8').toString().length) {
      writeFileSync(uri.fsPath, getDocComment(uri));
    }
  });
});
