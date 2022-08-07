/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @FilePath D:\CodeSpace\Dev\extension\likan\src\extension.ts
 */

import { ExtensionContext } from 'vscode'
import { commands } from './command'
import './others'

export async function activate(context: ExtensionContext) {
  context.subscriptions.push(...commands)
}

export function deactivate() {}
