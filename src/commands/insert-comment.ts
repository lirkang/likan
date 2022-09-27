/**
 * @Author likan
 * @Date 2022/8/22 10:55:19
 * @Filepath likan/src/commands/insert-comment.ts
 */

import normalizePath from 'normalize-path';

import { getConfig } from '@/common/utils';

export default async function insertComment({ document: { uri }, insertSnippet }: vscode.TextEditor) {
  await insertSnippet(
    new vscode.SnippetString(
      `/**
 * @Author ${getConfig('author', uri)}
 * @Date $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE $CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND
 * @Filepath ${normalizePath(vscode.workspace.asRelativePath(uri, true))}
 * @Description $1
 */\n\n$0\n`
    ),
    new vscode.Position(0, 0),
    { undoStopAfter: false, undoStopBefore: false }
  );
}
