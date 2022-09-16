/**
 * @Author likan
 * @Date
 * @FilePath E:\WorkSpace\likan\src\commands\tags-wrap.ts
 */

import { getConfig } from '@/common/utils';

export default async function tagsWrap({ document, insertSnippet, selections }: vscode.TextEditor) {
  const { tag } = getConfig();

  for await (const selection of selections) {
    const rangeText = document.getText(selection);

    await insertSnippet(
      new vscode.SnippetString(`<\${1|${tag}|}$2>\n\t${rangeText.replaceAll('$', '\\$')}\n</$1>`),
      selection,
      { undoStopAfter: false, undoStopBefore: false }
    );
  }

  await vscode.commands.executeCommand('editor.action.formatDocument');
}
