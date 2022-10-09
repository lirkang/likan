/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @Filepath likan/src/common/providers.ts
 */

import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import imagePreviewProvider from '@/classes/ImagePreviewProvider';
import pathJumpProvider from '@/classes/PathJumpProvider';

import { LANGUAGES } from './constants';

export const explorerTreeView = vscode.window.createTreeView('likan-explorer', {
  showCollapseAll: true,
  treeDataProvider: explorerTreeViewProvider,
});

export const definitionProvider = vscode.languages.registerDefinitionProvider(
  [...LANGUAGES, 'vue', 'json'],
  pathJumpProvider
);

export const hoverProvider = vscode.languages.registerHoverProvider(
  [...LANGUAGES, 'vue', 'json'],
  imagePreviewProvider
);

vscode.commands.executeCommand('setContext', 'likan.htmlId', ['html', 'htm']);
vscode.commands.executeCommand('setContext', 'likan.languageId', LANGUAGES);
vscode.commands.executeCommand('setContext', 'likan.wrapId', [...LANGUAGES, 'html', 'htm', 'svg', 'xml', 'vue']);
