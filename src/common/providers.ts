/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import environmentProvider from '@/classes/EnvironmentProvider';
import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import imagePreviewProvider from '@/classes/ImagePreviewProvider';
import pathJumpProvider from '@/classes/PathJumpProvider';

import { JAVASCRIPT_WARD_PATTERN as wordPattern, LANGUAGES } from './constants';

const explorerTreeView = vscode.window.createTreeView('likan-explorer', {
  showCollapseAll: true,
  treeDataProvider: explorerTreeViewProvider,
});

const providers = [
  vscode.languages.registerDefinitionProvider([...LANGUAGES, 'vue', 'json'], pathJumpProvider),
  // eslint-disable-next-line quotes
  vscode.languages.registerCompletionItemProvider([...LANGUAGES, 'vue'], environmentProvider, '.', "'", '`', '"'),
  ...[...LANGUAGES, 'vue', 'json'].map(l => vscode.languages.setLanguageConfiguration(l, { wordPattern })),
  vscode.languages.registerHoverProvider([...LANGUAGES, 'vue', 'json'], imagePreviewProvider),
  // vscode.languages.registerLinkedEditingRangeProvider([...LANGUAGES, 'vue', 'xml', 'svg'], linkedEditingProvider),
  explorerTreeView,
] as const;

export default providers;
