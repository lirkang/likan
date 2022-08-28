/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @FilePath D:\CodeSpace\Dev\likan\src\index.ts
 */

import commands from '@/commands';
import languages from '@/languages';
import { listeners, statusbarItems, Timer } from '@/others';

const features = [commands, statusbarItems, languages, listeners].flat();

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...features);
}

export async function deactivate() {
  clearInterval(Timer);
  features.forEach(({ dispose }) => dispose());
}
