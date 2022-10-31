/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @Filepath likan/src/common/providers.ts
 */

import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import imagePreviewProvider from '@/classes/ImagePreviewProvider';
import pathJumpProvider from '@/classes/PathJumpProvider';

import { LANGUAGES } from './constants';
import { getRootUri } from './utils';

const languages = [ ...LANGUAGES, 'vue', 'json' ];

export const explorerTreeView = vscode.window.createTreeView('likan-explorer', {
  canSelectMany: true,
  dragAndDropController: {
    dragMimeTypes: [],
    dropMimeTypes: [],
    handleDrag () {
      //
    },
    handleDrop () {
      //
    },
  },
  showCollapseAll: true,
  treeDataProvider: explorerTreeViewProvider,
});

explorerTreeView.onDidChangeVisibility(({ visible }) => visible && explorerTreeViewProvider.refresh());
explorerTreeView.onDidChangeSelection(({ selection }) => vscode.commands.executeCommand('setContext', 'likan.treeViewSelected', selection.length >= 2));

vscode.commands.executeCommand('setContext', 'likan.htmlId', [ 'html', 'htm' ]);
vscode.commands.executeCommand('setContext', 'likan.languageId', LANGUAGES);
vscode.commands.executeCommand('setContext', 'likan.wrapId', [ ...LANGUAGES, 'html', 'htm', 'svg', 'xml', 'vue' ]);
getRootUri(vscode.window.activeTextEditor?.document.uri).then(uri => vscode.commands.executeCommand('setContext', 'likan.showPackageScript', Boolean(uri)));

export const definitionProvider = vscode.languages.registerDefinitionProvider(languages, pathJumpProvider);
export const hoverProvider = vscode.languages.registerHoverProvider(languages, imagePreviewProvider);
