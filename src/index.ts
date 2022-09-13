/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @FilePath D:\CodeSpace\Dev\likan\src\index.ts
 */

import commands from '@/commands';
import { listeners, providers, statusbar, Timer, updateFileSize, updateMemory } from '@/common';

const features = [commands, statusbar, providers, listeners].flat();

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...features);

  await updateMemory();
  await updateFileSize();
}

export async function deactivate() {
  clearInterval(Timer);

  await Promise.all(features.map(({ dispose }) => dispose?.()));
}
