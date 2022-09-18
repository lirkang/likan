/**
 * @Author likan
 * @Date
 * @FilePath E:\WorkSpace\likan\src\commands\tags-wrap.ts
 */

import { getConfig } from '@/common/utils';

export default async function tagsWrap({ document, insertSnippet, selections, selection, edit }: vscode.TextEditor) {
  if (selections.length > 1) return;

  const { tag } = getConfig();
  const { isEmpty, start } = selection;
  const { getText, lineAt } = document;
  const { range } = lineAt(start.line);
  const rangeText = getText(isEmpty ? range : selection).replaceAll('$', '\\$');

  if (isEmpty) {
    await edit(editor => editor.delete(range), { undoStopAfter: false, undoStopBefore: false });
  }

  await insertSnippet(
    new vscode.SnippetString(`<\${1:${tag}} $2>\n${rangeText.replace(/(^\s*?)(\S)/, '$1$$0$2')}\n</$1>`),
    isEmpty ? range : selection,
    { undoStopAfter: false, undoStopBefore: false }
  );
}
