/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @Filepath likan/src/index.ts
 */

import commands from '@/commands';
import { listeners, providers, statusbar, Timer } from '@/common';

import vscodeContext from './classes/Context';

const features = [commands, statusbar, providers, listeners].flat();

export async function activate(context: vscode.ExtensionContext) {
  vscodeContext.initContext(context);
  context.subscriptions.push(...features);

  await Promise.all(statusbar.map(({ updater }) => updater?.()));
}

export async function deactivate() {
  clearInterval(Timer);

  await Promise.all(features.map(({ dispose }) => dispose?.()));
}
