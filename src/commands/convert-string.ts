/**
 * @Author
 * @Date 2022/09/10 09:38:09
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\convert-string.ts
 */

import { Utils } from 'vscode-uri';

import { DOC_COMMENT_EXT } from '@/common/constants';
import { removeMatchedStringAtStartAndEnd, toSafetySnippetString } from '@/common/utils';

function insertBracket(inserter: vscode.TextEditor['insertSnippet'], position: vscode.Position) {
  inserter(new vscode.SnippetString('{$1}'), position);
}

export default async function convertString() {
  if (!vscode.window.activeTextEditor) return;

  const { document, edit, selections, selection, insertSnippet } = vscode.window.activeTextEditor;
  const { isEmpty, isSingleLine, active } = selection;
  const extname = Utils.extname(document.uri);

  if (selections.length > 1 || !isEmpty || !isSingleLine || !DOC_COMMENT_EXT.includes(extname)) {
    for await (const selection of selections) {
      await edit(editor => editor.replace(selection, `{${document.getText(selection)}}`));
    }

    return;
  }

  const textRange = document.getWordRangeAtPosition(active, /["'`].*["'`]/);
  const text = document.getText(textRange);

  if (!text || !textRange || /^`.*`$/.test(text)) return insertBracket(insertSnippet, active);

  const lastTextRange = new vscode.Range(active.line, active.character - 1, active.line, active.character);

  if (document.getText(lastTextRange) !== '$') return insertBracket(insertSnippet, active);

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
