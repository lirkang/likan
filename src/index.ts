/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @FilePath D:\CodeSpace\Dev\likan\src\index.ts
 */

import commands from '@/commands';
import { listeners, providers, statusbar, Timer } from '@/common';

const features = [commands, statusbar, providers, listeners].flat();

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...features);
}

export async function deactivate() {
  for await (const { dispose } of features) await dispose?.();
  clearInterval(Timer);
}
