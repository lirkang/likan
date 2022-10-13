/**
 * @Author likan
 * @Date 2022-09-03 11:20:00
 * @Filepath likan/src/commands/tags-wrap.ts
 */

import { times } from 'lodash-es';

import Editor from '@/classes/Editor';

export default async function tagsWrap({ document, selections, selection, options }: vscode.TextEditor) {
  if (selections.length > 1) return;

  const { start, isEmpty, isSingleLine, end } = selection;
  const { lineAt, uri } = document;
  const editor = new Editor(uri);
  const { range, text } = lineAt(start.line);
  const tabSize = options.insertSpaces ? ' '.repeat(<number>options.tabSize) : '\t';
  const match = text.match(/(?<space>^\s*?)\S/);
  const space = match?.groups?.space ?? '';

  const startTranslate = (line = 0, character = -start.character) => start.translate(line, character);

  let startTagPosition: vscode.Position;
  let endTagPosition: vscode.Position;

  if (isEmpty) {
    if (start.character === range.end.character && lineAt(start.line).text.trim().length > 0) {
      editor.insert(start.translate(0, -start.character), `${space}<${Configuration.tag}>\n${tabSize}`);
      editor.insert(end, `\n${space}</${Configuration.tag}>`);

      startTagPosition = new vscode.Position(start.line, space.length + 1 + Configuration.tag.length);
      endTagPosition = new vscode.Position(start.line + 2, space.length + 2 + Configuration.tag.length);
    } else {
      editor.insert(start, `<${Configuration.tag}>`);
      editor.insert(start, `</${Configuration.tag}>`);

      startTagPosition = startTranslate(0, 1 + Configuration.tag.length);
      endTagPosition = startTranslate(0, 1 + Configuration.tag.length * 2 + 3);
    }
  } else if (isSingleLine) {
    editor.insert(start, `<${Configuration.tag}>`);
    editor.insert(end, `</${Configuration.tag}>`);

    startTagPosition = new vscode.Position(start.line, start.character + 1 + Configuration.tag.length);
    endTagPosition = new vscode.Position(end.line, end.character + 2 + Configuration.tag.length * 2 + 2);
  } else {
    const startSpace =
      start.character === 0
        ? space
        : text.slice(Math.max(0, start.character)).match(/((?<space>^ *?)\S)/)?.groups?.space ?? '';

    editor.insert(start, `${startSpace}<${Configuration.tag}>\n${text.slice(0, start.character)}${tabSize}`);
    editor.insert(end, `\n${space}</${Configuration.tag}>`);

    times(Math.abs(end.line - start.line), index => {
      const line = start.line + index + 1;
      const { text } = lineAt(line);

      if (text.trim().length > 0) editor.insert(new vscode.Position(line, 0), tabSize);
    });

    startTagPosition = new vscode.Position(start.line, space.length + 1 + Configuration.tag.length);
    endTagPosition = new vscode.Position(end.line + 2, space.length + 2 + Configuration.tag.length);
  }

  await editor.done();

  if (!vscode.window.activeTextEditor) return;

  vscode.window.activeTextEditor.selections = [
    new vscode.Selection(startTagPosition, startTagPosition),
    new vscode.Selection(endTagPosition, endTagPosition),
  ];

  const dispose = () => {
    changeTextDocument.dispose();
    changeActiveTextEditor.dispose();
  };

  const changeTextDocument = vscode.workspace.onDidChangeTextDocument(async ({ contentChanges, reason }) => {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor || activeTextEditor.selections.length !== 2 || reason) return dispose();

    const { text = '' } = contentChanges?.[0] ?? {};

    if ([' ', '\t'].includes(text)) {
      const [startRange, { start, end }] = activeTextEditor.selections;
      const entTagRange =
        (!isEmpty && isSingleLine) ||
        // eslint-disable-next-line unicorn/consistent-destructuring
        (isEmpty && selection.start.character !== range.end.character) ||
        range.end.character === 0
          ? new vscode.Range(end.translate(0, 1), end.translate(0, 2))
          : new vscode.Range(start, start.translate(0, 1));

      if (/\s/.test(document.getText(entTagRange))) {
        await new Editor(uri).delete(entTagRange).done();
      }

      activeTextEditor.selection = new vscode.Selection(
        startRange.start.translate(0, 1),
        startRange.start.translate(0, 1)
      );

      dispose();
    }
  });

  const changeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(dispose);
}
