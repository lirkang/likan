/**
 * @Author likan
 * @Date
 * @Filepath src/commands/tags-wrap.ts
 */

import { times } from 'lodash-es';

import Editor from '@/classes/Editor';
import { getConfig } from '@/common/utils';

export default async function tagsWrap({ document, insertSnippet, selections, selection, options }: vscode.TextEditor) {
  if (selections.length > 1) return;

  const { start, isEmpty, isSingleLine, end } = selection;
  const { getText, lineAt, uri } = document;
  const tag = getConfig('tag');
  const editor = new Editor(uri);
  const { range, text } = lineAt(start.line);
  const rangeText = (isEmpty ? text : getText(selection)).replaceAll('$', '\\$');
  const tabSize = options.insertSpaces ? ' '.repeat(<number>options.tabSize) : '\t';

  const match = text.match(/(?<space>^\s*?)\S/);
  const space = match?.groups?.space ?? '';
  const snippetString = `<\${1:${tag}} $2>\n${rangeText.replace(/(^\s*?)(\S)/, '$1$$0$2')}\n</$1>`;

  await insertSnippet(new vscode.SnippetString(snippetString), isEmpty ? range : selection, {
    undoStopAfter: false,
    undoStopBefore: false,
  });

  const startTranslate = (character: number, line = 0) => start.translate(line, character);

  if (isSingleLine) {
    editor.insert(startTranslate(0), space);
    editor.insert(startTranslate(1), tabSize);
    editor.insert(startTranslate(2), space);
  } else {
    if (start.character === 0) {
      editor.insert(startTranslate(0), space);
      editor.insert(end.translate(2, -end.character), space);
    }

    times(Math.abs(end.line - start.line + 1), index => {
      editor.insert(startTranslate(0, index + 1), tabSize);
    });
  }

  await editor.done();
}
