/**
 * @Author likan
 * @Date 2022/8/22 10:55:19
 * @FilePath E:\WorkSpace\likan\src\commands\insert-comment.ts
 */

import { POSITION } from '@/common/constants';
import { formatDocument, getDocumentComment } from '@/common/utils';

export default function insertComment() {
  if (!vscode.window.activeTextEditor) return;

  const { insertSnippet, document } = vscode.window.activeTextEditor;

  insertSnippet(new vscode.SnippetString(getDocumentComment(document.uri)), POSITION).then(formatDocument);
}
