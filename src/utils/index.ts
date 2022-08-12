/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import { DEFAULT_EXT } from '@/constants';
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

  const exts = [...DEFAULT_EXT, ...(additionalExt ?? [])];

  for (const e of exts) {
    if (existsSync(`${path}${e}`)) {
      return `${path}${e}`;
    } else if (existsSync(`${path}/index${e}`)) {
      return `${path}/index${e}`;
    }
  }
}

function getConfig(): Config {
  const configs = workspace.getConfiguration('likan');

  const config: Config = {
    author: configs.get('other.author')!,
    manager: configs.get('npm.manager')!,
    fileSize: configs.get('statusbar.fileSize')!,
    memory: configs.get('statusbar.memory')!,
    htmlTag: configs.get('other.htmlTag')!,
    terminal: configs.get('statusbar.terminal')!,
  };

  return config;
}

function getDocComment(uri: Uri) {
  return `/**
 * @Author ${getConfig().author}
 * @Date ${new Date().toLocaleString()}
 * @FilePath ${toFirstUpper(uri.fsPath)}
 */\n\n`;
}

export { formatSize, toFirstUpper, getRootPath, addExt, getConfig, getDocComment };
