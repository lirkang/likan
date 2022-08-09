/**
 * @Author likan
 * @Date 2022-08-09 20:33:03
 * @FilePath D:\CodeSpace\Dev\likan\src\utils\index.ts
 */

import { workspace } from 'vscode';

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

function getWorkspaceRootPath() {
  workspace.name;
}

export { formatSize, toFirstUpper, getWorkspaceRootPath };
