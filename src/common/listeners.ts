/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @Filepath likan/src/common/listeners.ts
 */

import { parse } from 'comment-parser';
import { isEqual } from 'lodash-es';

import Editor from '@/classes/Editor';

import { LANGUAGES } from './constants';
import { fileSize, memory } from './statusbar';
import { exist, getConfig } from './utils';

const changeActiveTextEditorHandler = async (textEditor?: vscode.TextEditor) => {
  if (!textEditor) return fileSize.resetState();

  const config = getConfig();
  const { uri, getText, lineCount, lineAt, languageId } = textEditor.document;

  if (!exist(uri) || uri.scheme !== 'file') return fileSize.resetState();
  else fileSize.update(uri, config.fileSize);

  if (!config.comment || !LANGUAGES.includes(languageId)) return;

  const range = new vscode.Range(0, 0, lineCount - 1, lineAt(lineCount - 1).range.end.character);
  const documentText = getText(range);

  if (documentText.trim().length === 0) {
    return await vscode.commands.executeCommand('likan.language.comment', textEditor);
  }

  const [{ source = [], tags = [] }] = parse(documentText);

  for (const [index, { number }] of source.entries()) {
    const { tag } = tags[index] ?? {};

    if (!/(filepath)|(filename)/i.test(tag)) continue;

    const relativePath = vscode.workspace.asRelativePath(uri, true);

    return new Editor(uri).replace(lineAt(number + 1).range, ` * @Filepath ${relativePath}`).done();
  }
};

const changeConfigurationHandler = () => {
  const config = getConfig();

  fileSize.update(vscode.window.activeTextEditor?.document, config.fileSize);
  memory.setVisible(config.memory);
};

const changeTextDocumentHandler = async ({ document, contentChanges, reason }: vscode.TextDocumentChangeEvent) => {
  const { getText, getWordRangeAtPosition, languageId, lineAt, lineCount, uri } = document;

  const { activeTextEditor } = vscode.window;
  if (!activeTextEditor || !isEqual(uri, activeTextEditor?.document.uri)) return;

  fileSize.update(uri, getConfig('fileSize'));

  if (![...LANGUAGES, 'vue'].includes(languageId) || reason) return;

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

  if (selections.length > 1 || !matched || !textRange || !/^{.*}$/s.test(insertText.join(''))) return;
  if (matched[0].length % 2 === 0) return;

  const editor = new Editor(uri);
  let counter = 0;

  editor.replace(
    [
      [textRange.end.translate(0, -1), textRange.end],
      [textRange.start, textRange.start.translate(0, 1)],
    ],
    '`'
  );

  if (/`+/g.test(matchedTextWithoutQuote)) {
    editor.replace(
      textRange.start.translate(0, 1),
      textRange.end.translate(0, -1),
      matchedTextWithoutQuote.replaceAll(/\\*`/g, (string, index: number) =>
        string.length % 2
          ? ((counter += Number(index < start.character - textRange.start.character)), `\\${string}`)
          : string
      )
    );
  }

  await editor.done();

  if (!isEmpty) return;

  activeTextEditor.selection = new vscode.Selection(start.translate(0, counter + 1), start.translate(0, counter + 1));
};

export const changeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(changeActiveTextEditorHandler);
export const changeConfiguration = vscode.workspace.onDidChangeConfiguration(changeConfigurationHandler);
export const changeTextDocument = vscode.workspace.onDidChangeTextDocument(changeTextDocumentHandler);
