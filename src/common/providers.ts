/**
 * @Author likan
 * @Date 2022-08-07 20:07:11
 * @Filepath likan/src/common/providers.ts
 */

import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import pathJumpProvider from '@/classes/PathJumpProvider';

import { LANGUAGES } from './constants';
import { findRoot } from './utils';

const DEFINED_EXPANDED_LANGS = [ 'vue', 'json' ];
const WRAPTAG_LANGS = [ 'html', 'htm', 'svg', 'xml', 'vue', 'wxml' ];

const TRANSFORM_ACTIONS: Array<vscode.Command> = [
  { arguments: [ 'camelCase' ], command: 'likan.other.changeCase', title: '转换camel格式' },
  { arguments: [ 'kebabCase' ], command: 'likan.other.changeCase', title: '转换kebab格式' },
  { arguments: [ 'pascalCase' ], command: 'likan.other.changeCase', title: '转换pascal格式' },
  { arguments: [ 'snakeCase' ], command: 'likan.other.changeCase', title: '转换snake格式' },
  { arguments: [ 'upperSnakeCase' ], command: 'likan.other.changeCase', title: '转换upperSnake格式' },
  { command: 'likan.other.changeCase', title: '转换格式' },
];

const WRAPTAG_ACTIONS: Array<vscode.Command> = [ { command: 'likan.language.wrap', title: '创建标签' } ];

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
vscode.commands.executeCommand('setContext', 'likan.languageId', [ ...LANGUAGES ]);
vscode.commands.executeCommand('setContext', 'likan.wrapId', [ ...LANGUAGES, ...WRAPTAG_LANGS ]);

findRoot(vscode.window.activeTextEditor?.document.uri).then(uri => vscode.commands.executeCommand('setContext', 'likan.showPackageScript', Boolean(uri)));

export const definitionProvider = vscode.languages.registerDefinitionProvider(
  [ ...LANGUAGES, ...DEFINED_EXPANDED_LANGS ],
  pathJumpProvider,
);

export const codeActionsProvider = vscode.languages.registerCodeActionsProvider(
  [ ...LANGUAGES, ...WRAPTAG_LANGS, 'json' ],
  {
    provideCodeActions () {
      return [ ...TRANSFORM_ACTIONS, ...WRAPTAG_ACTIONS ];
    },
  },
);
