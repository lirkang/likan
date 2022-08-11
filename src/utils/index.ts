/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import { Uri, window, workspace } from 'vscode';

function formatSize(size: number, containSuffix = true) {
  if (size < 1024 * 1024) {
    const temp = size / 1024;

    return temp.toFixed(2) + (containSuffix ? ' K' : '');
  } else if (size < 1024 * 1024 * 1024) {
    const temp = size / (1024 * 1024);

    return temp.toFixed(2) + (containSuffix ? ' M' : '');
  } else {
    const temp = size / (1024 * 1024 * 1024);

    return temp.toFixed(2) + (containSuffix ? ' G' : '');
  }
}

function toFirstUpper(str: string) {
  return str.replace(/./, m => m.toUpperCase());
}

function getRootPath(targetUri?: Uri) {
  if (!targetUri) {
    if (window.activeTextEditor?.document) {
      targetUri = window.activeTextEditor.document.uri;
    } else {
      return;
    }
  }

  if (!workspace.workspaceFolders) {
    return;
  }

  const folds = workspace.workspaceFolders;

  if (folds.length > 1) {
    for (const { uri } of folds) {
      if (targetUri.fsPath.indexOf(uri.fsPath) !== -1) {
        return uri.fsPath;
      }
    }
  } else
    for (const { uri } of folds) {
      if (targetUri.fsPath.indexOf(uri!.fsPath) !== -1) {
        const word = targetUri.fsPath.slice(uri.fsPath.length).split('\\')[1];

        const path = resolve(uri.fsPath, word);

        return existsSync(resolve(path, 'package.json')) ? path : uri.fsPath;
      }
    }
}

function addExt(path: string, additionalExt?: Array<string>) {
  const reg = /.*\.[a-zA-Z]+/;

  if (reg.test(path)) return path;

  const exts = ['.js', '.ts', '.jsx', '.tsx', ...(additionalExt ?? [])];

  for (const e of exts) {
    if (existsSync(`${path}${e}`)) {
      return `${path}${e}`;
    } else if (existsSync(`${path}/index${e}`)) {
      return `${path}/index${e}`;
    }
  }
}

export { formatSize, toFirstUpper, getRootPath, addExt };
