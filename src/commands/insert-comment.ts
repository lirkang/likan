/**
 * @Author likan
 * @Date 2022/8/22 10:55:19
 * @Filepath likan/src/commands/insert-comment.ts
 */

import normalizePath from 'normalize-path';

import { formatDate, getConfig } from '@/common/utils';

export default async function insertComment({ document: { uri }, insertSnippet }: vscode.TextEditor) {
  const contents = [
    '/**',
    ` * @Author ${getConfig('author', uri)}`,
    ` * @Date ${formatDate()}`,
    ` * @Filepath ${normalizePath(vscode.workspace.asRelativePath(uri, true))}`,
    ' * @Description $1',
    ' */\n\n$0\n',
  ];

  await insertSnippet(new vscode.SnippetString(contents.join('\n')), new vscode.Position(0, 0), {
    undoStopAfter: false,
    undoStopBefore: false,
  });
}
