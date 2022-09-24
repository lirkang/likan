/**
 * @Author likan
 * @Date
 * @Filepath E:/TestSpace/extension/likan/src/commands/tags-wrap.ts
 */

import { getConfig } from '@/common/utils';

export default async function tagsWrap({
  document,
  insertSnippet,
  selections,
  selection,
  edit,
  options,
}: vscode.TextEditor) {
  if (selections.length > 1) return;

  const { tag } = getConfig();
  const { isEmpty, start, isSingleLine, end } = selection;
  const { getText, lineAt } = document;
  const { range } = lineAt(start.line);
  const rangeText = getText(isEmpty ? range : selection).replaceAll('$', '\\$');
  const tabSize = options.insertSpaces ? ' '.repeat(<number>options.tabSize) : '\t';

  await insertSnippet(
    new vscode.SnippetString(`<\${1:${tag}} $2>\n${rangeText.replace(/(^\s*?)(\S)/, '$1$$0$2')}\n</$1>`),
    isEmpty ? range : selection,
    { undoStopAfter: false, undoStopBefore: false }
  );

  if (!isSingleLine) {
    await edit(
      async editBuilder => {
        for (let index = 0; index < end.line - start.line + 3; index++) {
          editBuilder.insert(new vscode.Position(index + start.line, 0), tabSize);
        }
      },
      { undoStopAfter: false, undoStopBefore: false }
    );
  }
}
