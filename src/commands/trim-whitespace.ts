/**
 * @Author likan
 * @Date 2022/09/03 13:52:09
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\trim-whitespace.ts
 */

import { POSITION } from '@/common/constants';
import { deleteLeft } from '@/common/utils';

export default async function trimWhitespace() {
  if (!vscode.window.activeTextEditor) return;

  const { document, selection, edit, selections } = vscode.window.activeTextEditor;

  if (selections.length > 1 || !selection.isEmpty) return await deleteLeft();

  const documentToStartRange = new vscode.Range(POSITION, selection.active);
  const documentToStart = document.getText(documentToStartRange);
  let { character, line } = selection.active;

  for (const text of [...documentToStart].reverse()) {
    if (/\s/.test(text)) {
      character = /\n/.test(text) ? document.lineAt(--line).range.end.character + 1 : character - 1;
    } else {
      // eslint-disable-next-line unicorn/consistent-destructuring
      if (character === selection.active.character && line === selection.active.line) return deleteLeft();

      const position = new vscode.Position(line, character);

      return edit(editor => editor.delete(new vscode.Range(position, selection.active)));
    }
  }
}
