/**
 * @Author likan
 * @Date 2022/8/22 10:55:19
 * @FilePath E:\WorkSpace\likan\src\commands\insert-comment.ts
 */

import { POSITION } from '@/common/constants';
import { getDocumentCommentSnippet } from '@/common/utils';

export default async function insertComment({ document, insertSnippet }: vscode.TextEditor) {
  await insertSnippet(getDocumentCommentSnippet(document.uri), POSITION);
}
