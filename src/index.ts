/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @Filepath likan/src/index.ts
 */

import { flatMap } from 'lodash-es';

import features from '@/common';

export function activate (context: vscode.ExtensionContext) {
  for (const { update } of Object.values(features.statusbar)) update();

  context.subscriptions.push(...flatMap(features));
}

export function deactivate () {
  vscode.Disposable.from(...flatMap(features)).dispose();
}
