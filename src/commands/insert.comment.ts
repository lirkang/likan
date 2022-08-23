/**
 * @Author likan
 * @Date 2022/8/22 10:55:19
 * @FilePath E:\WorkSpace\likan\src\commands\insert.comment.ts
 */

import { POSITION } from '@/constants';
import { getDocComment } from '@/utils';

export default function insertComment() {
  if (!vscode.window.activeTextEditor) return;

  const { insertSnippet, document } = vscode.window.activeTextEditor;

  insertSnippet(new vscode.SnippetString(getDocComment(document.uri.fsPath)), POSITION).then(() => {
    vscode.commands.executeCommand('editor.action.formatDocument').then(() => {
      //
    });
  });
}
