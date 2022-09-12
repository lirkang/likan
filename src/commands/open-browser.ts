/**
 * @Author Likan
 * @Date 2022/09/05 22:18:54
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\open-browser.ts
 */

import open from 'open';

import { BROWSERS } from '@/common/constants';
import { getKeys } from '@/common/utils';

export async function openDefaultBrowser(uri = vscode.window.activeTextEditor?.document.uri) {
  if (!uri) return;

  open(uri.fsPath);
}

export async function openSpecifyBrowser(uri = vscode.window.activeTextEditor?.document.uri) {
  if (!uri) return;

  const browser = await vscode.window.showQuickPick(getKeys(BROWSERS), { canPickMany: true });

  if (!browser) return;

  await Promise.all(browser.map(key => open(uri.fsPath, { app: { name: BROWSERS[key] } })));
}
