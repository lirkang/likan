/**
 * @Author likan
 * @Date 2022/09/03 13:52:09
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\trim-whitespace.ts
 */

import { EMPTY_STRING, POSITION } from '@/common/constants';

async function deleteLeft() {
  await vscode.commands.executeCommand('deleteLeft');
}

export default async function trimWhitespace() {
  if (!vscode.window.activeTextEditor) return;

  const { document, selection, edit, selections } = vscode.window.activeTextEditor;

  if (selections.length > 1) return await deleteLeft();

  const documentToStartRange = new vscode.Range(POSITION, selection.active);
  const documentToStart = document.getText(documentToStartRange);
  let { character, line } = selection.active;

  for (const text of [...documentToStart].reverse()) {
    if (/\s/.test(text)) {
      /\n/.test(text) ? line-- : character--;

      if (character < 0) character = document.lineAt(line).range.end.character;
    } else {
      // eslint-disable-next-line unicorn/consistent-destructuring
      if (character === selection.active.character && line === selection.active.line) {
        await deleteLeft();
      }

      break;
    }
  }

  edit(editor =>
    editor.replace(new vscode.Range(new vscode.Position(line, character), selection.active), EMPTY_STRING)
  );
}
