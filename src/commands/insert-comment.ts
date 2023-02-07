/**
 * @Author likan
 * @Date 2022/8/22 10:55:19
 * @Filepath likan/src/commands/insert-comment.ts
 */

import { normalize } from 'node:path';

import { formatDate } from '@/common/utils';

export default async function insertComment(textEditor: vscode.TextEditor) {
  const {
    document: { uri, getText, lineAt, lineCount },
    insertSnippet,
    selections: [...selections],
  } = textEditor;

  const startPosition = new vscode.Position(0, 0);
  const endPosition = new vscode.Position(lineCount - 1, lineAt(lineCount - 1).range.end.character);
  const fullDocumentRange = new vscode.Range(startPosition, endPosition);
  const isEmpty = getText(fullDocumentRange).trim().length === 0;

  const contents = [
    '/**',
    ` * @Author ${Configuration.AUTHOR}`,
    ` * @Date ${formatDate()}`,
    ` * @Filepath ${normalize(vscode.workspace.asRelativePath(uri, true))}`,
    ' */\n\n$0',
  ];

  await insertSnippet(new vscode.SnippetString(contents.join('\n')), isEmpty ? fullDocumentRange : startPosition);

  if (!isEmpty) textEditor.selections = selections;
}
