/**
 * @Author likan
 * @Date 2022/09/03 13:52:09
 * @Filepath E:/TestSpace/extension/likan/src/commands/trim-whitespace.ts
 */

import { POSITION } from '@/common/constants';

async function deleteLeft() {
  await vscode.commands.executeCommand('deleteLeft');
}

export default async function trimWhitespace({ document, selection, edit, selections }: vscode.TextEditor) {
  if (selections.length > 1 || !selection.isEmpty) return await deleteLeft();

  const rangeToStart = new vscode.Range(POSITION, selection.active);
  const documentToStart = document.getText(rangeToStart);
  let { character, line } = selection.active;

  if (/^\s+$/.test(documentToStart)) return edit(editBuilder => editBuilder.delete(rangeToStart));

  for (const text of [...documentToStart].reverse()) {
    if (/\s/.test(text)) {
      character = /\n/.test(text) ? document.lineAt(--line).range.end.character + 1 : character - 1;
    } else {
      const position = new vscode.Position(line, character);

      if (selection.active.isEqual(position)) {
        const range = new vscode.Range(selection.active.translate(0, -1), selection.active.translate(0, 1));

        return document.getText(range) === '<>' ? edit(editBuilder => editBuilder.delete(range)) : deleteLeft();
      }

      return edit(editBuilder => editBuilder.delete(new vscode.Range(position, selection.active)));
    }
  }
}
