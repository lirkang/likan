/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @Filepath E:/TestSpace/extension/likan/src/common/providers.ts
 */

import environmentProvider from '@/classes/EnvironmentProvider';
import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import imagePreviewProvider from '@/classes/ImagePreviewProvider';
import pathJumpProvider from '@/classes/PathJumpProvider';

import { LANGUAGES } from './constants';

const explorerTreeView = vscode.window.createTreeView('likan-explorer', {
  showCollapseAll: true,
  treeDataProvider: explorerTreeViewProvider,
});

const providers = [
  vscode.languages.registerDefinitionProvider([...LANGUAGES, 'vue', 'json'], pathJumpProvider),
  vscode.languages.registerCompletionItemProvider([...LANGUAGES, 'vue'], environmentProvider, '.', '\'', '`', '"'),
  vscode.languages.registerHoverProvider([...LANGUAGES, 'vue', 'json'], imagePreviewProvider),
  // vscode.languages.registerLinkedEditingRangeProvider([...LANGUAGES, 'vue', 'xml', 'svg'], linkedEditingProvider),
  explorerTreeView,
] as const;

export default providers;
