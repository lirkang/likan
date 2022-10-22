/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @Filepath likan/src/index.ts
 */

import { forEach } from 'lodash-es';

import features from '@/common';

const flatFeatures = Object.values(features).flatMap<vscode.Disposable>(values => (Array.isArray(values) ? values : Object.values(values)));

export function activate (context: vscode.ExtensionContext) {
  forEach(features.statusbar, ({ update }) => update());
  context.subscriptions.push(...flatFeatures);
}

export async function deactivate () {
  //
}
