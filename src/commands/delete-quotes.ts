/**
 * @Author Likan
 * @Date 2022/09/05 22:22:43
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\delete-quotes.ts
 */

import { removeMatchedStringAtStartAndEnd } from '@/common/utils';

export default function deleteQuotes() {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) return;

  const { selections, edit, document } = activeTextEditor;

  for (const { active } of selections) {
    const range = document.getWordRangeAtPosition(active, /["'([`{].*["')\]`}]/g);

    if (!range) continue;

    const text = document.getText(range);

    edit(editor => {
      editor.delete(range);
      editor.insert(
        range.start,
        removeMatchedStringAtStartAndEnd(text, ["'", '"', '`', '(', '[', '{', '<'], ["'", '"', '`', ')', ']', '}', '>'])
      );
    });
  }
}
