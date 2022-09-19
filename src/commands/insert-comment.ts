/**
 * @Author likan
 * @Date 2022/8/22 10:55:19
 * @Filepath E:/TestSpace/extension/likan/src/commands/insert-comment.ts
 */

import { POSITION } from '@/common/constants';
import { getConfig, toNormalizePath } from '@/common/utils';

export default async function insertComment({ document: { uri, ...document }, insertSnippet }: vscode.TextEditor) {
  await insertSnippet(
    new vscode.SnippetString(
      `/**
 * @Author ${getConfig('author', uri)}
 * @Date $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE $CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND
 * @Filepath ${toNormalizePath(uri)}
 * @Description $1
 */\n\n$0\n`
    ),
    POSITION,
    { undoStopAfter: false, undoStopBefore: false }
  );
}
