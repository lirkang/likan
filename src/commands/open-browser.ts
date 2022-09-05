/**
 * @Author Likan
 * @Date 2022/09/05 22:18:54
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\open-browser.ts
 */

import open from 'open';

import { BROWSERS, TRUE } from '@/common/constants';
import { getKeys } from '@/common/utils';

export async function openDefaultBrowser({ fsPath }: vscode.Uri = vscode.window.activeTextEditor!.document.uri) {
  open(fsPath);
}

export async function openSpecifyBrowser({ fsPath }: vscode.Uri = vscode.window.activeTextEditor!.document.uri) {
  const browser = await vscode.window.showQuickPick(getKeys(BROWSERS), { canPickMany: TRUE });

  if (!browser) return;

  await Promise.all(browser.map(key => open(fsPath, { app: { name: BROWSERS[key] } })));
}
