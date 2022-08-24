/**
 * @Author likan
 * @Date 2022/8/22 10:55:11
 * @FilePath E:\WorkSpace\likan\src\commands\html.wrap.ts
 */

import { formatDocument, getConfig } from '@/utils';

export default function tagsWrap() {
  if (!vscode.window.activeTextEditor) return;

  const { document, insertSnippet, selections } = vscode.window.activeTextEditor;

  const tagListToSnippet = getConfig('tags').join(',');

  selections.forEach(selection => {
    const range = document.getText(selection).replaceAll('$', '\\$');

    insertSnippet(
      new vscode.SnippetString(`<\${1|${tagListToSnippet}|} \${2:property}>\n\t${range}\n</$1>`),
      selection
    );
  });

  formatDocument();
}
