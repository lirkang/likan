/**
 * @Author likan
 * @Date 2022/09/03 13:52:09
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\trim-whitespace.ts
 */

import { POSITION, VOID } from '@/common/constants';

async function deleteLeft() {
  await vscode.commands.executeCommand('deleteLeft');
}

export default async function trimWhitespace({ document, selection, edit, selections }: vscode.TextEditor) {
  if (selections.length > 1 || !selection.isEmpty) return await deleteLeft();

  const rangeToStart = new vscode.Range(POSITION, selection.active);
  const documentToStart = document.getText(rangeToStart);
  let { character, line } = selection.active;

  if (/^\s+$/.test(documentToStart)) {
    return edit(editor => editor.delete(rangeToStart));
  }

  for (const text of [...documentToStart].reverse()) {
    if (/\s/.test(text)) {
      character = /\n/.test(text) ? document.lineAt(--line).range.end.character + 1 : character - 1;
    } else {
      // eslint-disable-next-line unicorn/consistent-destructuring
      if (character === selection.active.character && line === selection.active.line) {
        const range = new vscode.Range(selection.active.translate(VOID, -1), selection.active.translate(VOID, 1));

        if (document.getText(range) === '<>') {
          edit(editor => editor.delete(range));
        } else {
          return deleteLeft();
        }
      }

      const position = new vscode.Position(line, character);

      return edit(editor => editor.delete(new vscode.Range(position, selection.active)));
    }
  }
}
