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

const TRANSFORM_ACTIONS: Array<vscode.Command> = [
  { arguments: [ 'Camel Case' ], command: 'likan.other.changeCase', title: '转换camel格式' },
  { arguments: [ 'Kebab Case' ], command: 'likan.other.changeCase', title: '转换kebab格式' },
  { arguments: [ 'Pascal Case' ], command: 'likan.other.changeCase', title: '转换pascal格式' },
  { arguments: [ 'Snake Case' ], command: 'likan.other.changeCase', title: '转换snake格式' },
  { arguments: [ 'Upper Snake Case' ], command: 'likan.other.changeCase', title: '转换upperSnake格式' },
  { command: 'likan.other.changeCase', title: '转换格式' },
];

const WRAP_TAG_ACTIONS: Array<vscode.Command> = [ { command: 'likan.language.wrap', title: '创建标签' } ];

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
vscode.commands.executeCommand('setContext', 'likan.wrapId', [ ...LANGUAGES, ...WRAP_TAG_LANGS ]);

export const definitionProvider = vscode.languages.registerDefinitionProvider(
  [ ...LANGUAGES, ...DEFINED_EXPANDED_LANGS ],
  pathJumpProvider,
);

export const codeActionsProvider = vscode.languages.registerCodeActionsProvider(
  [ ...LANGUAGES, ...WRAP_TAG_LANGS, 'json' ],
  {
    provideCodeActions ({ languageId, uri }, { start }, { diagnostics }) {
      const actions: Array<vscode.Command | vscode.CodeAction> = [ ...TRANSFORM_ACTIONS ];

      if (WRAP_TAG_LANGS.includes(languageId)) actions.push(...WRAP_TAG_ACTIONS);
      if (diagnostics.some(({ source }) => source && [ 'typescript', 'ts' ].includes(source)))
        actions.push(
          {
            arguments: [ uri, [ new vscode.Position(start.line - 1, 0) ], '\n// @ts-ignore' ],
            command: 'likan.other.insertText',
            kind: vscode.CodeActionKind.Refactor,
            title: '禁用此行ts检查',
          },

          {
            arguments: [ uri, [ new vscode.Position(0, 0) ], '// @ts-nocheck\n\n' ],
            command: 'likan.other.insertText',
            kind: vscode.CodeActionKind.Refactor,
            title: '禁用整个文件ts检查',
          },
        );

      return actions;
    },
  },
);
