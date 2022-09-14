/**
 * @Author likan
 * @Date
 * @FilePath E:\WorkSpace\likan\src\commands\tags-wrap.ts
 */

import { formatDocument, getConfig, toSafetySnippetString } from '@/common/utils';

export default async function tagsWrap({ document, insertSnippet, selections }: vscode.TextEditor) {
  const { tag } = getConfig();

  for await (const selection of selections) {
    const rangeText = document.getText(selection);

    await insertSnippet(
      new vscode.SnippetString(`<\${1|${tag}|} $2>\n\t${toSafetySnippetString(rangeText)}\n</$1>`),
      selection
    );
  }

  await formatDocument();
}
