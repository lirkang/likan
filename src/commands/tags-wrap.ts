/**
 * @Author likan
 * @Date
 * @FilePath E:\WorkSpace\likan\src\commands\tags-wrap.ts
 */

import { formatDocument, getConfig } from '@/common/utils';

export default async function tagsWrap() {
  if (!vscode.window.activeTextEditor) return;

  const { document, insertSnippet, selections } = vscode.window.activeTextEditor;
  const { tag } = getConfig();

  for await (const selection of selections) {
    const rangeText = document.getText(selection).replaceAll('$', '\\$');

    await insertSnippet(new vscode.SnippetString(`<\${1|${tag}|}>\n\t${rangeText}\n</${tag}>`), selection);
  }

  await formatDocument();
}
