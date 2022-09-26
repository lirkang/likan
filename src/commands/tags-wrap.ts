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
  const selectAfterEdit: Array<vscode.Selection> = [];

  const startTranslate = (line = 0, character = -start.character) => start.translate(line, character);

  if (isEmpty && start.character !== range.end.character) {
    editor.insert(start, `<${tag} > `);
    editor.insert(start, `</${tag}>`);

    selectAfterEdit.push(
      new vscode.Selection(startTranslate(0, 1), startTranslate(0, 1 + tag.length)),
      new vscode.Selection(startTranslate(0, 1 + tag.length + 4), startTranslate(0, 1 + tag.length + 4 + tag.length))
    );
  } else if (isSingleLine) {
    editor.insert(range.start, `${space}<${tag} > \n`);
    editor.insert(range.end, `\n${space}</${tag}>`);
    editor.insert(range.start, tabSize);

    selectAfterEdit.push(
      new vscode.Selection(start.line, space.length + 1, start.line, space.length + 1 + tag.length),
      new vscode.Selection(start.line + 2, space.length + 2, start.line + 2, space.length + 2 + tag.length)
    );
  } else {
    const startSpace =
      start.character === 0
        ? space
        : text.slice(Math.max(0, start.character)).match(/((?<space>^ *?)\S)/)?.groups?.space ?? '';

    editor.insert(start, `${startSpace}<${tag} > \n${text.slice(0, start.character)}${tabSize}`);
    editor.insert(end, `\n${space}</${tag}>`);

    times(Math.abs(end.line - start.line), index => {
      editor.insert(new vscode.Position(start.line + index + 1, 0), tabSize);
    });

    selectAfterEdit.push(
      new vscode.Selection(start.line, space.length + 1, start.line, space.length + 1 + tag.length),
      new vscode.Selection(end.line + 2, space.length + 2, end.line + 2, space.length + 2 + tag.length)
    );
  }

  await editor.done();

  if (!vscode.window.activeTextEditor) return;

  vscode.window.activeTextEditor.selections = selectAfterEdit;
}
