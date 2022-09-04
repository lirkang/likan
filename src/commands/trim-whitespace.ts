/**
 * @Author likan
 * @Date 2022/09/03 13:52:09
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\trim-whitespace.ts
 */

import { POSITION } from '@/common/constants';

async function deleteLeft() {
  await vscode.commands.executeCommand('deleteLeft');
}

export default async function trimWhitespace() {
  if (!vscode.window.activeTextEditor) return;

  const { document, selection, edit, selections } = vscode.window.activeTextEditor;

  if (selections.length > 1 || !selection.isEmpty) return await deleteLeft();

  const documentToStartRange = new vscode.Range(POSITION, selection.active);
  const documentToStart = document.getText(documentToStartRange);
  let { character, line } = selection.active;

  for (const text of [...documentToStart].reverse()) {
    if (/\s/.test(text)) {
      /\n/.test(text) ? line-- : character--;

      if (character < 0) character = document.lineAt(line).range.end.character;
    } else {
      // eslint-disable-next-line unicorn/consistent-destructuring
      if (character === selection.active.character && line === selection.active.line) return await deleteLeft();

      break;
    }
  }

  await edit(editor => editor.delete(new vscode.Range(new vscode.Position(line, character), selection.active)));
}
