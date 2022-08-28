/**
 * @Author likan
 * @Date 2022/8/21 19:32:37
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\open.window.ts
 */

import { FALSE } from '@/constants';
import { openFolder } from '@/utils';

export function openCurrent(uri: vscode.Uri) {
  if (!uri) {
    vscode.window.showWarningMessage('没有在资源管理器上触发命令');
  } else {
    const { fsPath } = uri;

    openFolder(fsPath);
  }
}

export function openNew(uri: vscode.Uri) {
  if (!uri) {
    vscode.window.showWarningMessage('没有在资源管理器上触发命令');
  } else {
    const { fsPath } = uri;

    openFolder(fsPath, FALSE);
  }
}
