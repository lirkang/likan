/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @Filepath likan/src/common/providers.ts
 */

import { isUndefined } from 'lodash-es';

import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import imagePreviewProvider from '@/classes/ImagePreviewProvider';
import pathJumpProvider from '@/classes/PathJumpProvider';

import { LANGUAGES } from './constants';
import { exists, getRootUri } from './utils';

const languages = [ ...LANGUAGES, 'vue', 'json' ];

export const explorerTreeView = vscode.window.createTreeView('likan-explorer', {
  canSelectMany: true,
  dragAndDropController: {
    dragMimeTypes: [ 'application/vnd.code.tree.likan-explorer' ],
    dropMimeTypes: [ 'application/vnd.code.tree.likan-explorer' ],
    handleDrop (target) {
      if (exists(target)) vscode.commands.executeCommand('likan.open.newWindow', target);
    },
  },
  showCollapseAll: true,
  treeDataProvider: explorerTreeViewProvider,
});

explorerTreeView.onDidChangeSelection(({ selection }) => {
  vscode.commands.executeCommand('setContext', 'likan.treeViewSelected', selection.length >= 2);
});

explorerTreeView.onDidChangeVisibility(({ visible }) => visible && explorerTreeViewProvider.refresh());

export const definitionProvider = vscode.languages.registerDefinitionProvider(languages, pathJumpProvider);
export const hoverProvider = vscode.languages.registerHoverProvider(languages, imagePreviewProvider);
console.log('likan - providers.ts - line at 37 =>', getRootUri(vscode.window.activeTextEditor?.document.uri));

vscode.commands.executeCommand('setContext', 'likan.htmlId', [ 'html', 'htm' ]);
vscode.commands.executeCommand('setContext', 'likan.languageId', LANGUAGES);
vscode.commands.executeCommand('setContext', 'likan.wrapId', [ ...LANGUAGES, 'html', 'htm', 'svg', 'xml', 'vue' ]);

getRootUri(vscode.window.activeTextEditor?.document.uri).then(uri => vscode.commands.executeCommand('setContext', 'likan.showPackageScript', Boolean(!isUndefined(uri))));
