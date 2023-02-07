/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @Filepath likan/src/common/listeners.ts
 */

import { parse } from 'comment-parser';
import { normalize } from 'node:path';

import Editor from '@/classes/Editor';
import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import insertComment from '@/commands/insert-comment';
import { exist } from '@/common/utils';

import { Config, LANGUAGES } from './constants';
import { fileSize, memory } from './statusbar';

const updateComment = function (textEditor: vscode.TextEditor) {
  const { lineAt, getText, uri } = textEditor.document;

  const documentRange = new vscode.Range(0, 0, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  const documentText = getText(documentRange);

  if (documentText.trim().length === 0) {
    if (Configuration.COMMENT) insertComment(textEditor);

    return;
  }

  const [{ tags = [] }] = parse(documentText);

  for (const { tag, source } of tags) {
    if (!/(filepath)|(filename)/i.test(tag)) continue;

    const [{ tokens, number }] = source;
    const originPath = normalize(tokens.name);

    if (originPath.length > 0 && normalize(uri.fsPath).endsWith(originPath)) return;

    const relativePath = normalize(vscode.workspace.asRelativePath(uri, true));

    return new Editor(uri).replace(lineAt(number).range, ` * @Filepath ${relativePath}`).apply();
  }
};

const changeActiveTextEditorHandler = async function (textEditor?: vscode.TextEditor) {
  fileSize.update();

  if (
    !textEditor ||
    textEditor.document.isUntitled ||
    !exist(textEditor.document.uri) ||
    !LANGUAGES.includes(textEditor.document.languageId) ||
    textEditor.document.uri.fsPath.includes('node_modules')
  )
    return;

  const { size } = await vscode.workspace.fs.stat(textEditor.document.uri);

  // 文件过大不解析
  if (size >= 1024 * 512) return;

  updateComment(textEditor);
};

// TODO: 需要优化
const changeTextDocumentHandler = function ({ document, contentChanges, reason }: vscode.TextDocumentChangeEvent) {
  const { getText, getWordRangeAtPosition, languageId, uri, isClosed } = document;
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor || isClosed || activeTextEditor.document.uri.fsPath !== uri.fsPath) return;

  fileSize.update();

  if (![...LANGUAGES, 'vue'].includes(languageId) || reason || contentChanges.length === 0) return;

  const [
    {
      text,
      range: { start },
    },
  ] = contentChanges;

  if (text !== '{}' || start.character === 0) return;

  const preText = getText(new vscode.Range(start.translate(0, -1), start));

  if (preText !== '$') return;

  const regexp = /(["']).*?((?<!\\)\1)/;
  const stringRange = getWordRangeAtPosition(start, regexp);

  if (!stringRange) return;

  return new Editor(uri)
    .replace(
      [
        new vscode.Range(stringRange.start, stringRange.start.translate(0, 1)),
        new vscode.Range(stringRange.end.translate(0, -1), stringRange.end),
      ],
      '`'
    )
    .apply();
};

export const changeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(changeActiveTextEditorHandler);
export const changeTextDocument = vscode.workspace.onDidChangeTextDocument(changeTextDocumentHandler);

export const changeConfiguration = vscode.workspace.onDidChangeConfiguration(({ affectsConfiguration }) => {
  if (
    affectsConfiguration(Config.DESCRIPTION) ||
    affectsConfiguration(Config.FOLDERS) ||
    affectsConfiguration(Config.FILTER_FOLDERS)
  )
    explorerTreeViewProvider.refresh();

  if (affectsConfiguration(Config.MEMORY)) memory.update();
  if (affectsConfiguration(Config.FILE_SIZE)) fileSize.update();
});
