/**
 * @Author likan
 * @Date 2022/09/03 09:58:15
 * @Filepath likan/src/common/listeners.ts
 */

import { parse } from 'comment-parser';
import { isEqual } from 'lodash-es';

import Editor from '@/classes/Editor';
import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import { getRootUri } from '@/common/utils';

import { LANGUAGES } from './constants';
import { fileSize } from './statusbar';

vscode.workspace.onDidChangeConfiguration(({ affectsConfiguration }) => (affectsConfiguration('likan.show.description')) && explorerTreeViewProvider.refresh());

async function updateComment (textEditor: vscode.TextEditor) {
  const { lineAt, lineCount, getText, uri } = textEditor.document;

  const documentRange = new vscode.Range(
    0,
    0,
    lineCount - 1,
    lineAt(lineCount - 1).rangeIncludingLineBreak.end.character,
  );
  const documentText = getText(documentRange);

  if (documentText.trim().length === 0) vscode.commands.executeCommand('likan.language.comment', textEditor);
  else {
    const [ { tags = [] } = { tags: [] } ] = parse(documentText);

    for await (const { tag, source } of tags) {
      if (!/(filepath)|(filename)/i.test(tag)) continue;
      const [ { tokens, number } ] = source;
      const relativePath = vscode.workspace.asRelativePath(uri, true);
      const originPath = tokens.name;

      if (relativePath !== originPath)
        await new Editor(uri)
          .delete(lineAt(number).rangeIncludingLineBreak)
          .insert(new vscode.Position(number, 0), ` * @Filepath ${relativePath}\n`)
          .done();

      break;
    }
  }
}

const changeActiveTextEditorHandler = async (textEditor?: vscode.TextEditor) => {
  fileSize.update(textEditor?.document);

  vscode.commands.executeCommand(
    'setContext',
    'likan.showPackageScript',
    Boolean(await getRootUri(textEditor?.document.uri)),
  );

  if (!textEditor) return;

  if (Configuration.comment && LANGUAGES.includes(textEditor.document.languageId)) updateComment(textEditor);
};

const changeTextDocumentHandler = async ({ document, contentChanges, reason }: vscode.TextDocumentChangeEvent) => {
  const { getText, getWordRangeAtPosition, languageId, lineAt, lineCount, uri } = document;
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor || !isEqual(uri, activeTextEditor?.document.uri)) return;

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

  await editor.done();

  if (!isEmpty) return;

  activeTextEditor.selection = new vscode.Selection(start.translate(0, counter + 1), start.translate(0, counter + 1));
};

export const changeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(changeActiveTextEditorHandler);
export const changeTextDocument = vscode.workspace.onDidChangeTextDocument(changeTextDocumentHandler);
