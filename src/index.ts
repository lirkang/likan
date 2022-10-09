/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @Filepath likan/src/index.ts
 */

import { forEach, unary } from 'lodash-es';

import features from '@/common';

import Context from './classes/Context';

const flatFeatures = Object.values(features).flatMap<vscode.Disposable>(unary(Object.values));

export async function activate(context: vscode.ExtensionContext) {
  forEach(features.statusbar, ({ updater }) => updater());

  Context.init(context);

  context.subscriptions.push(...flatFeatures);
}

export async function deactivate() {
  for (const { dispose } of flatFeatures) dispose();
}
