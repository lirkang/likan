/**
 * @Author likan
 * @Date 2022-09-03 11:20:00
 * @Filepath likan/src/commands/tags-wrap.ts
 */

import { curry, times } from 'lodash-es';

import Editor from '@/classes/Editor';

const isEmptyAndNotOnLastCharacterAndEmpty: TagWrapHandler = function ({ selection }, editor) {
  const { start } = selection;

  editor.insert(start, `<${Configuration.TAG}>`);
  editor.insert(start, `</${Configuration.TAG}>`);

  return [start.translate(0, 1 + Configuration.TAG.length), start.translate(0, 1 + Configuration.TAG.length * 2 + 3)];
};

const isEmptyAndOnLastCharacter: TagWrapHandler = function ({ document, selection }, editor, tabSize) {
  const { start, end } = selection;
  const { text } = document.lineAt(start.line);
  const match = text.match(/^(?<space>^\s*?)\S/);
  const space = match?.groups?.space ?? '';

  editor.insert(start.translate(0, -start.character), `${space}<${Configuration.TAG}>\n${tabSize}`);
  editor.insert(end, `\n${space}</${Configuration.TAG}>`);

  return [
    new vscode.Position(start.line, space.length + 1 + Configuration.TAG.length),
    new vscode.Position(start.line + 2, space.length + 2 + Configuration.TAG.length),
  ];
};

const isSingleLineAndNotEmpty: TagWrapHandler = function ({ selection }, editor) {
  const { start, end } = selection;

  editor.insert(start, `<${Configuration.TAG}>`);
  editor.insert(end, `</${Configuration.TAG}>`);

  return [
    new vscode.Position(start.line, start.character + 1 + Configuration.TAG.length),
    new vscode.Position(end.line, end.character + 2 + Configuration.TAG.length * 2 + 2),
  ];
};

const otherwiseHandler: TagWrapHandler = function ({ selection, document }, editor, tabSize) {
  const { start, end } = selection;
  const { text } = document.lineAt(start.line);
  const fullLineSpace = text.match(/^(?<space>\s*)\S/)?.groups?.space ?? '';
  const frontSpae = fullLineSpace.slice(0, start.character);
  const behindSpace = fullLineSpace.slice(start.character);

  editor.insert(start, `${behindSpace}<${Configuration.TAG}>\n${frontSpae}${tabSize}`);
  editor.insert(end, `\n${fullLineSpace}</${Configuration.TAG}>`);

  times(Math.abs(start.line - end.line), index => {
    const line = start.line + index + 1;

    const { range } = document.lineAt(line);

    if (!range.isEmpty) editor.insert(line, 0, tabSize);
  });

  return [
    start.translate(0, behindSpace.length + Configuration.TAG.length + 1),
    new vscode.Position(end.line + 2, fullLineSpace.length + Configuration.TAG.length + 2),
  ];
};

const tagWrapHandler = function (textEditor: vscode.TextEditor) {
  const { selection, document } = textEditor;
  const { start, isEmpty, isSingleLine } = selection;
  const { text, range } = document.lineAt(start.line);

  return curry(
    (() => {
      if (isEmpty)
        return start.character === range.end.character && text.trim().length > 0
          ? isEmptyAndOnLastCharacter
          : isEmptyAndNotOnLastCharacterAndEmpty;
      else if (isSingleLine) return isSingleLineAndNotEmpty;
      else return otherwiseHandler;
    })()
  )(textEditor);
};

export default async function tagsWrap(textEditor: vscode.TextEditor) {
  const { document, selections, options } = textEditor;

  if (selections.length > 1) return;

  const { length } = Configuration.TAG;
  const editor = new Editor(document.uri);
  const tabSize = options.insertSpaces ? ' '.repeat(<number>options.tabSize) : '\t';
  const [startTagPosition, endTagPosition] = tagWrapHandler(textEditor)(editor, tabSize);
  const startSelection = new vscode.Selection(startTagPosition.translate(0, -length), startTagPosition);
  const endSelection = new vscode.Selection(endTagPosition.translate(0, -length), endTagPosition);

  await editor.apply();

  textEditor.selections = [startSelection, endSelection];

  const dispose = () => {
    changeTextDocument.dispose();
    changeActiveTextEditor.dispose();
    textEditorSelection.dispose();
  };

  const textEditorSelection = vscode.window.onDidChangeTextEditorSelection(({ kind }) => {
    if (kind === vscode.TextEditorSelectionChangeKind.Mouse) dispose();
  });

  const changeTextDocument = vscode.workspace.onDidChangeTextDocument(async ({ contentChanges }) => {
    const { selections, document } = textEditor;
    const { text = '' } = contentChanges?.[0] ?? {};

    if (selections.length !== 2) return dispose();

    if ([' ', '\t'].includes(text)) {
      await vscode.commands.executeCommand('undo');

      const [{ end }] = selections;
      const finalSelection = end.translate(0, 1);

      await new Editor(document.uri).insert(end, ' ').apply();

      textEditor.selection = new vscode.Selection(finalSelection, finalSelection);

      dispose();
    }
  });

  const changeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(dispose);
}
