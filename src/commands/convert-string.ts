/**
 * @Author
 * @Date 2022/09/10 09:38:09
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\convert-string.ts
 */

import { removeMatchedStringAtStartAndEnd, toSafetySnippetString } from '@/common/utils';

export default async function convertString() {
  if (!vscode.window.activeTextEditor) return;

  const { document, edit, selections, selection, insertSnippet } = vscode.window.activeTextEditor;
  const { isEmpty, isSingleLine, active } = selection;

  if (selections.length > 1 || !isEmpty || !isSingleLine) {
    for await (const selection of selections) {
      await edit(editor => editor.replace(selection, `{${document.getText(selection)}}`));
    }

    return;
  }

  const textRange = document.getWordRangeAtPosition(active, /["'`].*["'`]/);
  const text = document.getText(textRange);

  if (!text || !textRange || /^`.*`$/.test(text)) {
    return insertSnippet(new vscode.SnippetString('{$1}'), active);
  }

  const lastTextRange = new vscode.Range(active.line, active.character - 1, active.line, active.character);

  if (document.getText(lastTextRange) !== '$') {
    return insertSnippet(new vscode.SnippetString('{$1}'), active);
  }

  await edit(editor => editor.delete(textRange));

  const character = active.character - textRange.start.character;

  const [beforeString, afterString] = [
    removeMatchedStringAtStartAndEnd(text.slice(0, character)),
    removeMatchedStringAtStartAndEnd(text.slice(character, -1)),
  ];

  insertSnippet(
    new vscode.SnippetString(toSafetySnippetString(`\`${beforeString}{***1}${afterString}\``)),
    textRange.start
  );
}
