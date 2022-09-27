/**
 * @Author likan
 * @Date
 * @Filepath src/commands/tags-wrap.ts
 */

import { times } from 'lodash-es';

import Editor from '@/classes/Editor';
import { getConfig } from '@/common/utils';

export default async function tagsWrap({ document, selections, selection, options }: vscode.TextEditor) {
  if (selections.length > 1) return;

  const { start, isEmpty, isSingleLine, end } = selection;
  const { lineAt, uri } = document;
  const tag = getConfig('tag');
  const editor = new Editor(uri);
  const { range, text } = lineAt(start.line);
  const tabSize = options.insertSpaces ? ' '.repeat(<number>options.tabSize) : '\t';
  const match = text.match(/(?<space>^\s*?)\S/);
  const space = match?.groups?.space ?? '';

  const startTranslate = (line = 0, character = -start.character) => start.translate(line, character);

  let startTagPosition: vscode.Position;
  let endTagPosition: vscode.Position;

  if (isEmpty) {
    if (start.character !== range.end.character) {
      editor.insert(start, `<${tag}>`);
      editor.insert(start, `</${tag}>`);

      startTagPosition = startTranslate(0, 1 + tag.length);
      endTagPosition = startTranslate(0, 1 + tag.length * 2 + 3);
    } else {
      editor.insert(start.translate(0, -start.character), `${space}<${tag}>\n${tabSize}`);
      editor.insert(end, `\n${space}</${tag}>`);

      startTagPosition = new vscode.Position(start.line, space.length + 1 + tag.length);
      endTagPosition = new vscode.Position(start.line + 2, space.length + 2 + tag.length);
    }
  } else if (isSingleLine) {
    editor.insert(start, `<${tag}>`);
    editor.insert(end, `</${tag}>`);

    startTagPosition = new vscode.Position(start.line, start.character + 1 + tag.length);
    endTagPosition = new vscode.Position(end.line, end.character + 2 + tag.length * 2 + 2);
  } else {
    const startSpace =
      start.character === 0
        ? space
        : text.slice(Math.max(0, start.character)).match(/((?<space>^ *?)\S)/)?.groups?.space ?? '';

    editor.insert(start, `${startSpace}<${tag}>\n${text.slice(0, start.character)}${tabSize}`);
    editor.insert(end, `\n${space}</${tag}>`);

    times(Math.abs(end.line - start.line), index => {
      editor.insert(new vscode.Position(start.line + index + 1, 0), tabSize);
    });

    startTagPosition = new vscode.Position(start.line, space.length + 1 + tag.length);
    endTagPosition = new vscode.Position(end.line + 2, space.length + 2 + tag.length);
  }

  await editor.done();

  if (!vscode.window.activeTextEditor) return;

  vscode.window.activeTextEditor.selections = [
    new vscode.Selection(startTagPosition, startTagPosition),
    new vscode.Selection(endTagPosition, endTagPosition),
  ];

  const dispose = () => {
    workspaceListener.dispose();
    activeEditorListener.dispose();
  };

  const workspaceListener = vscode.workspace.onDidChangeTextDocument(async ({ contentChanges, reason }) => {
    if (!vscode.window.activeTextEditor || (reason && reason in vscode.TextDocumentChangeReason)) return dispose();

    const { text = '' } = contentChanges?.[0] ?? {};
    
    if ([' ', '\t'].includes(text)) {
      const [{ start }, endRange] = vscode.window.activeTextEditor.selections;
      const entTagRange = new vscode.Range(endRange.start, endRange.start.translate(0, 1));

      if ([' ', '\t'].includes(document.getText(entTagRange))) {
        await new Editor(uri).delete(entTagRange).done();
      }

      vscode.window.activeTextEditor.selection = new vscode.Selection(start.translate(0, 1), start.translate(0, 1));

      dispose();
    }
  });

  const activeEditorListener = vscode.window.onDidChangeActiveTextEditor(dispose);
}
