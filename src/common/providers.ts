/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @Filepath likan/src/common/providers.ts
 */

import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import pathJumpProvider from '@/classes/PathJumpProvider';

import { LANGUAGES } from './constants';

const DEFINED_EXPANDED_LANGS = [ 'vue', 'json' ];
const WRAP_TAG_LANGS = [ 'html', 'htm', 'svg', 'xml', 'vue', 'wxml' ];

export const explorerTreeView = vscode.window.createTreeView('likan-explorer', {
  showCollapseAll: true,
  treeDataProvider: explorerTreeViewProvider,
});

explorerTreeView.onDidChangeVisibility(({ visible }) => explorerTreeViewProvider.refresh(visible));

vscode.commands.executeCommand('setContext', 'likan.htmlId', [ 'html', 'htm' ]);
vscode.commands.executeCommand('setContext', 'likan.languageId', [ ...LANGUAGES ]);
vscode.commands.executeCommand('setContext', 'likan.wrapId', [ ...LANGUAGES, ...WRAP_TAG_LANGS ]);

export const definitionProvider = vscode.languages.registerDefinitionProvider(
  [ ...LANGUAGES, ...DEFINED_EXPANDED_LANGS ],
  pathJumpProvider,
);
