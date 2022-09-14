/**
 * @Author likan
 * @Date 2022/8/22 10:55:19
 * @FilePath E:\WorkSpace\likan\src\commands\insert-comment.ts
 */

import normalizePath from 'normalize-path';

import { POSITION } from '@/common/constants';
import { getConfig, getDateString, toFirstUpper } from '@/common/utils';

export default async function insertComment({ document, insertSnippet }: vscode.TextEditor) {
  await insertSnippet(
    new vscode.SnippetString(
      `/**
 * @Author ${toFirstUpper(getConfig('author', document.uri))}
 * @Date ${getDateString()}
 * @FilePath ${toFirstUpper(normalizePath(document.uri.fsPath))}
 * @Description $1
 */\n\n$0\n`
    ),
    POSITION
  );
}
