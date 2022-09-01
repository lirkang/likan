/**
 * @Author likan
 * @Date
 * @FilePath E:\WorkSpace\likan\src\commands\html.wrap.ts
 */

import { formatDocument, getConfig } from '@/utils';

export default function tagsWrap() {
  if (!vscode.window.activeTextEditor) return;

  const { document, insertSnippet, selections } = vscode.window.activeTextEditor;
  const tag = getConfig('tag');

  for (const selection of selections) {
    const range = document.getText(selection).replaceAll('$', '\\$');

    insertSnippet(new vscode.SnippetString(`<\${1|${tag}|}>\n\t${range}\n</${tag}>`), selection);
  }

  formatDocument();
}
