/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @FilePath D:\CodeSpace\Dev\extension\likan\src\extension.ts
 */

import { commands } from '@/command'
import '@/others'
import { commands as vscodeCommands, ExtensionContext } from 'vscode'

export async function activate(context: ExtensionContext) {
  context.subscriptions.push(...commands.map(({ command, func }) => vscodeCommands.registerCommand(command, func)))
}

export function deactivate() {}
