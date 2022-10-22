/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @Filepath likan/src/index.ts
 */

import features from '@/common';

const flatFeatures = Object.values(features).flatMap(values => (Array.isArray(values) ? values : Object.values(values)));

export function activate (context: vscode.ExtensionContext) {
  for (const { update } of Object.values(features.statusbar)) update();
  context.subscriptions.push(...flatFeatures);
}

export async function deactivate () {
  //
}
