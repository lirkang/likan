/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @Filepath likan/src/common/listeners.ts
 */

import { parse } from 'comment-parser';

import Editor from '@/classes/Editor';
import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import insertComment from '@/commands/insert-comment';
import { exists, toNormalizePath } from '@/common/utils';

import { Config, LANGUAGES } from './constants';
import { fileSize, memory } from './statusbar';

function updateComment (textEditor: vscode.TextEditor) {
  const { lineAt, getText, uri } = textEditor.document;
  const documentRange = new vscode.Range(0, 0, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  const documentText = getText(documentRange);

  if (documentText.trim().length === 0) return insertComment(textEditor);

  const [ { tags = [] } ] = parse(documentText);

  for (const { tag, source } of tags) {
    if (!/(filepath)|(filename)/i.test(tag)) continue;

    const [ { tokens, number } ] = source;
    const relativePath = vscode.workspace.asRelativePath(uri, true);
    const originPath = tokens.name;

    if (originPath.length > 0 && toNormalizePath(uri.fsPath).endsWith(originPath)) return;

    return new Editor(uri).replace(lineAt(number).range, ` * @Filepath ${relativePath}`).apply();
  }
}

const changeActiveTextEditorHandler = async (textEditor?: vscode.TextEditor) => {
  if (!textEditor || textEditor.document.isUntitled || !exists(textEditor.document.uri)) return fileSize.resetState();

  const { uri, languageId } = textEditor.document;

  fileSize.update(uri);

  if (!Configuration.COMMENT || !LANGUAGES.includes(languageId) || uri.fsPath.includes('node_modules')) return;

  const { size } = await vscode.workspace.fs.stat(uri);

  if (size <= 1024 ** 1) updateComment(textEditor);
};

// TODO: 需要优化
const changeTextDocumentHandler = async ({ document, contentChanges, reason }: vscode.TextDocumentChangeEvent) => {
  const { getText, getWordRangeAtPosition, languageId, lineAt, lineCount, uri, isClosed } = document;
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor || isClosed) return;

  fileSize.update(document);

  if (![ ...LANGUAGES, 'vue' ].includes(languageId) || reason) return;

  // const insideStringRegexp = /(["'](?=[^"'])).*?((?<!\\)\1)/;
  const outsideStringRegexp = /(["']).*?((?<!\\)\1)/;

  const insertText = contentChanges.map(({ text }) => text).reverse();
  const { selections, selection } = activeTextEditor;
  const { start, isEmpty } = selection;
  const { text } = lineAt(start.line > lineCount - 1 ? lineCount - 1 : start.line);
  const frontText = text.slice(0, Math.max(0, start.character));
  const textRange = getWordRangeAtPosition(start, outsideStringRegexp);
  const matchedText = getText(textRange);
  const matchedTextWithoutQuote = matchedText.slice(1, -1);
  const matched = frontText.match(/(\\*?\$)$/);

  if (selections.length > 1 || !matched || !textRange || !/^\{.*\}$/su.test(insertText.join(''))) return;

  if (matched[0].length % 2 === 0) return;

  const editor = new Editor(uri);
  let counter = 0;

  editor.replace(
    [
      [ textRange.end.translate(0, -1), textRange.end ],
      [ textRange.start, textRange.start.translate(0, 1) ],
    ],
    '`',
  );

  if (/`+/g.test(matchedTextWithoutQuote))
    editor.replace(
      textRange.start.translate(0, 1),
      textRange.end.translate(0, -1),
      matchedTextWithoutQuote.replaceAll(/\\*`/g, (string, index: number) => (string.length % 2
        ? ((counter += Number(index < start.character - textRange.start.character)), `\\${string}`)
        : string)),
    );

  await editor.apply();

  if (!isEmpty) return;

  const position = start.translate(0, counter + 1);

  activeTextEditor.selection = new vscode.Selection(position, position);
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
