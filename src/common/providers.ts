/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @FilePath D:\CodeSpace\Dev\likan\src\others\vscode.ts
 */

import environmentProvider from '@/classes/EnvironmentProvider';
import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import linkedEditingProvider from '@/classes/LinkedEditingProvider';
import pathJumpProvider from '@/classes/PathJumpProvider';
import scriptTreeViewProvider from '@/classes/ScriptTreeViewProvider';

import { EMPTY_ARRAY, JAVASCRIPT_WARD_PATTERN as wordPattern, LANGUAGES, TRUE } from './constants';

const explorerTreeView = vscode.window.createTreeView('likan-explorer', {
  canSelectMany: TRUE,
  dragAndDropController: {
    dragMimeTypes: EMPTY_ARRAY,
    dropMimeTypes: EMPTY_ARRAY,
  },
  showCollapseAll: TRUE,
  treeDataProvider: explorerTreeViewProvider,
});

const scriptsTreeView = vscode.window.createTreeView('likan-scripts', {
  canSelectMany: TRUE,
  dragAndDropController: {
    dragMimeTypes: EMPTY_ARRAY,
    dropMimeTypes: EMPTY_ARRAY,
  },
  showCollapseAll: TRUE,
  treeDataProvider: scriptTreeViewProvider,
});

scriptsTreeView.onDidChangeVisibility(scriptTreeViewProvider.refresh);

const providers = [
  vscode.languages.registerDefinitionProvider([...LANGUAGES, 'vue', 'json'], pathJumpProvider),
  vscode.languages.registerCompletionItemProvider([...LANGUAGES, 'vue'], environmentProvider, '.', "'", '`', '"'),
  ...[...LANGUAGES, 'vue', 'json'].map(l => vscode.languages.setLanguageConfiguration(l, { wordPattern })),
  vscode.languages.registerLinkedEditingRangeProvider([...LANGUAGES, 'vue', 'xml', 'svg'], linkedEditingProvider),
  explorerTreeView,
  scriptsTreeView,
] as const;

export default providers;
