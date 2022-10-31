/**
 * @Author likan
 * @Date 2022/8/22 10:55:19
 * @Filepath likan/src/commands/insert-comment.ts
 */

import { format } from 'date-fns';
import normalizePath from 'normalize-path';

import { DATE_FORMAT } from '@/common/constants';

export default async function insertComment ({ document, insertSnippet }: vscode.TextEditor) {
  const position = new vscode.Position(0, 0);
  const contents = [
    '/**',
    ` * @Author ${Configuration.AUTHOR}`,
    ` * @Date ${format(new Date(), DATE_FORMAT)}`,
    ` * @Filepath ${normalizePath(vscode.workspace.asRelativePath(document.uri, true))}`,
    ' */\n\n$0',
  ];

  await insertSnippet(new vscode.SnippetString(contents.join('\n')), position);
}
