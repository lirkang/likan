/**
 * @Author likan
 * @Date 2022-09-03 11:20:00
 * @Filepath likan/src/commands/tags-wrap.ts
 */

import { times } from 'lodash-es';

import Editor from '@/classes/Editor';

interface TagWrapHandler {
  (textEditor: vscode.TextEditor, editor: Editor, tabSize: string): [
    startPosition: vscode.Position,
    endPosition: vscode.Position
  ];
}

const isEmptyAndNotOnLastCharacterAndEmpty: TagWrapHandler = ({ selection }, editor) => {
  const { start } = selection;

  editor.insert(start, `<${Configuration.tag}>`);
  editor.insert(start, `</${Configuration.tag}>`);

  return [ start.translate(0, 1 + Configuration.tag.length), start.translate(0, 1 + Configuration.tag.length * 2 + 3) ];
};

const isEmptyAndOnLastCharacter: TagWrapHandler = ({ document, selection }, editor, tabSize) => {
  const { start, end } = selection;
  const { text } = document.lineAt(start.line);
  const match = text.match(/^(?<space>^\s*?)\S/);
  const space = match?.groups?.space ?? '';

  editor.insert(start.translate(0, -start.character), `${space}<${Configuration.tag}>\n${tabSize}`);
  editor.insert(end, `\n${space}</${Configuration.tag}>`);

  return [
    new vscode.Position(start.line, space.length + 1 + Configuration.tag.length),
    new vscode.Position(start.line + 2, space.length + 2 + Configuration.tag.length),
  ];
};

const isSingleLineAndNotEmpty: TagWrapHandler = ({ selection }, editor) => {
  const { start, end } = selection;

  editor.insert(start, `<${Configuration.tag}>`);
  editor.insert(end, `</${Configuration.tag}>`);

  return [
    new vscode.Position(start.line, start.character + 1 + Configuration.tag.length),
    new vscode.Position(end.line, end.character + 2 + Configuration.tag.length * 2 + 2),
  ];
};

const otherwiseHandler: TagWrapHandler = ({ selection, document }, editor, tabSize) => {
  const { start, end } = selection;
  const { text } = document.lineAt(start.line);
  const fullLineSpace = text.match(/^(?<space>\s*)\S/)?.groups?.space ?? '';
  const frontSpae = fullLineSpace.slice(0, start.character);
  const behindSpace = fullLineSpace.slice(start.character);

  editor.insert(start, `${behindSpace}<${Configuration.tag}>\n${frontSpae}${tabSize}`);
  editor.insert(end, `\n${fullLineSpace}</${Configuration.tag}>`);

  times(Math.abs(start.line - end.line), index => {
    const line = start.line + index + 1;

    const { range } = document.lineAt(line);

    if (!range.isEmpty) editor.insert(line, 0, tabSize);
  });

  return [
    start.translate(0, behindSpace.length + Configuration.tag.length + 1),
    new vscode.Position(end.line + 2, fullLineSpace.length + Configuration.tag.length + 2),
  ];
};

const tagWrapHandler: (textEditor: vscode.TextEditor) => TagWrapHandler = ({ selection, document }) => {
  const { start, isEmpty, isSingleLine } = selection;
  const { text, range } = document.lineAt(start.line);

  if (isEmpty)
    return start.character === range.end.character && text.trim().length > 0
      ? isEmptyAndOnLastCharacter
      : isEmptyAndNotOnLastCharacterAndEmpty;
  else if (isSingleLine) return isSingleLineAndNotEmpty;
  else return otherwiseHandler;
};

export default async function tagsWrap (textEditor: vscode.TextEditor) {
  const { document, selections, options } = textEditor;

  if (selections.length > 1) return;

  const { length } = Configuration.tag;
  const editor = new Editor(document);
  const tabSize = options.insertSpaces ? ' '.repeat(<number>options.tabSize) : '\t';
  const [ startTagPosition, endTagPosition ] = tagWrapHandler(textEditor)(textEditor, editor, tabSize);
  const startSelection = new vscode.Selection(startTagPosition.translate(0, -length), startTagPosition);
  const endSelection = new vscode.Selection(endTagPosition.translate(0, -length), endTagPosition);

  await editor.done();

  textEditor.selections = [ startSelection, endSelection ];

  const dispose = () => {
    changeTextDocument.dispose();
    changeActiveTextEditor.dispose();
  };

  const changeTextDocument = vscode.workspace.onDidChangeTextDocument(async ({ contentChanges, reason }) => {
    const { selections, document } = textEditor;

    if (selections.length !== 2 || reason) return dispose();

    const { text = '' } = contentChanges?.[0] ?? {};

    if ([ ' ', '\t' ].includes(text)) {
      await vscode.commands.executeCommand('undo');

      const [ { end } ] = selections;
      const finalSelection = end.translate(0, 1);

      await new Editor(document).insert(end, ' ').done();

      textEditor.selection = new vscode.Selection(finalSelection, finalSelection);

      dispose();
    }
  });

  const changeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(dispose);
}
