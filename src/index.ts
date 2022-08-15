/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @FilePath D:\CodeSpace\Dev\likan\src\index.ts
 */

import '@/others';
import '@/languages';

import { commands as vscodeCommands, ExtensionContext } from 'vscode';

import { commands } from '@/commands';

export async function activate(context: ExtensionContext) {
  context.subscriptions.push(...commands.map(([command, func]) => vscodeCommands.registerCommand(command, func)));
}

export function deactivate() {
  //
}
