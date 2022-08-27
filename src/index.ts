/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @FilePath D:\CodeSpace\Dev\likan\src\index.ts
 */

import commands from '@/commands';
import languages from '@/languages';
import { listeners, statusbarItems } from '@/others';

import { Timer } from './others/vscode';

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...[commands, statusbarItems, languages, listeners].flat());
}

export function deactivate() {
  clearInterval(Timer);
  [commands, statusbarItems, languages, listeners].flat().forEach(({ dispose }) => dispose());
}
