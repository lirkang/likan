/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @FilePath D:\CodeSpace\Dev\likan\src\index.ts
 */

import '@/languages';
import '@/others';

import commands from '@/commands';

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...commands.map(([c, f]) => vscode.commands.registerCommand(c, f)));
}

export function deactivate() {
  //
}
