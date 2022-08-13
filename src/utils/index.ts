/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import { DEFAULT_EXT, DEFAULT_TAG, PACKAGE_JSON } from '@/constants';
import { existsSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { QuickPick, QuickPickItem, Uri, window, workspace } from 'vscode';

/**
 * 格式化文件大小
 * @param size 文件大小
 * @param containSuffix 是否添加单位
 * @param fixedIndex 保留几位小数
 * @returns 文件大小
 */
function formatSize(size: number, containSuffix = true, fixedIndex = 2) {
  if (size < 1024 * 1024) {
    const temp = size / 1024;

    return temp.toFixed(fixedIndex) + (containSuffix ? ' K' : '');
  } else if (size < 1024 * 1024 * 1024) {
    const temp = size / (1024 * 1024);

    return temp.toFixed(fixedIndex) + (containSuffix ? ' M' : '');
  } else {
    const temp = size / (1024 * 1024 * 1024);

    return temp.toFixed(fixedIndex) + (containSuffix ? ' G' : '');
  }
}

/**
 * 将字符串首字母转为大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
function toFirstUpper(str: string) {
  return str.replace(/./, m => m.toUpperCase());
}

/**
 * 获取工作区根目录(根据package.json判断)
 * @param fsPath 文件路径
 * @returns 根目录
 */
function getRootPath(fsPath = window.activeTextEditor?.document.uri.fsPath): string | undefined {
  try {
    if (!fsPath) return;

    if (statSync(fsPath).isDirectory()) {
      return existsSync(join(fsPath, PACKAGE_JSON)) ? fsPath : getRootPath(join(fsPath, '..'));
    } else {
      return fsPath.lastIndexOf(PACKAGE_JSON) === fsPath.length - PACKAGE_JSON.length
        ? dirname(fsPath)
        : getRootPath(join(fsPath, '..'));
    }
  } catch {
    return;
  }
}

/**
 * 自动根据路径补全后缀查询
 * @param path 路径
 * @param additionalExt 额外的后缀
 * @returns 查找到的文件
 */
function addExt(path: string, additionalExt?: Array<string>) {
  const reg = /.*\.[a-zA-Z]+/;

  if (reg.test(path)) return path;

  const { exts } = getConfig();

  for (const e of [...exts, ...(additionalExt ?? [])]) {
    if (existsSync(`${path}${e}`)) {
      return `${path}${e}`;
    } else if (existsSync(`${path}/index${e}`)) {
      return `${path}/index${e}`;
    }
  }
}

/**
 * 获取配置
 * @returns 配置
 */
function getConfig(): Config {
  const configuration = workspace.getConfiguration('likan');

  return {
    author: configuration.get('language.author', 'likan'),
    manager: configuration.get('npm.manager', 'npm'),
    fileSize: configuration.get('statusbar.fileSize', true),
    memory: configuration.get('statusbar.memory', true),
    terminal: configuration.get('statusbar.terminal', true),
    htmlTag: configuration.get('language.htmlTag', DEFAULT_TAG),
    exts: configuration.get('language.exts', DEFAULT_EXT),
  };
}

/**
 * 获取文档注释
 * @param uri 文件路径
 * @returns 文档注释
 */
function getDocComment(uri: Uri) {
  return `/**
 * @Author ${getConfig().author}
 * @Date ${new Date().toLocaleString()}
 * @FilePath ${toFirstUpper(uri.fsPath)}
 */\n\n`;
}

function quickPickThenable(fn: Thenable<QuickPickItem | undefined>): Promise<QuickPickItem>;
function quickPickThenable(fn: Thenable<string | undefined>): Promise<string>;
function quickPickThenable<K extends keyof QuickPickItem>(
  fn: Thenable<QuickPickItem | undefined>,
  key: K
): Promise<QuickPickItem[K]>;

function quickPickThenable<K extends keyof QuickPickItem>(fn: Thenable<QuickPickItem | undefined | string>, key?: K) {
  return new Promise<QuickPickItem | QuickPickItem[K] | string>(async (rs, rj) => {
    const result = await fn;

    if (typeof result === 'undefined') rj(result);
    else {
      if (typeof result === 'string') {
        rs(result);
      } else {
        rs(key ? result[key]! : result);
      }
    }
  });
}

export { formatSize, toFirstUpper, getRootPath, addExt, getConfig, getDocComment, quickPickThenable };
