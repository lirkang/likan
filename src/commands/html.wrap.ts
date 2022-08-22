/**
 * @Author likan
 * @Date 2022/8/22 10:55:11
 * @FilePath E:\WorkSpace\likan\src\commands\html.wrap.ts
 */

import { getConfig } from '@/utils';

export default function htmlWrap() {
  if (!vscode.window.activeTextEditor) return;

  const { document, selection, insertSnippet } = vscode.window.activeTextEditor;

  const text = document.getText(selection).replaceAll('$', '\\$');

  insertSnippet(new vscode.SnippetString(`<\${1|${getConfig('htmlTag').join(',')}|} $2>\n\t${text}\n</$1>`)).then(
    () => {
      vscode.commands.executeCommand('editor.action.formatDocument').then(() => {
        //
      });
    }
  );
}
