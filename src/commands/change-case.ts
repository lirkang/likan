/**
 * @Author likan
 * @Date 2022/09/05 22:23:42
 * @Filepath likan/src/commands/change-case.ts
 */

import { capitalize, curryRight, join, lowerFirst, toLower, toUpper, unary, words } from 'lodash-es';

import Editor from '@/classes/Editor';
import { getKeys } from '@/common/utils';

function toNormalize(mapCallback: (word: string) => string, callback: (words: Array<string>) => string) {
  return (text: string) => callback(words(text).map(unary(mapCallback)));
}

const curriedJoin: (separator: string) => (words: Array<string>) => string = curryRight(join);
const curriedCaseHandle = (caseHandle: (text: string) => string, separator: string) => (words: Array<string>) =>
  caseHandle(curriedJoin(separator)(words));

const wordTransformer: Record<string, [string, (text: string) => string]> = {
  ['camelCase']: ['camelCase', toNormalize(capitalize, curriedCaseHandle(lowerFirst, ''))],
  ['capitaCase']: ['CAPITAL CASE', toNormalize(toUpper, curriedJoin(' '))],
  ['dotCase']: ['dot.case', toNormalize(toLower, curriedJoin('.'))],
  ['kebabCase']: ['kebab-case', toNormalize(toLower, curriedJoin('-'))],
  ['lowercase']: ['lowercase', toNormalize(toLower, curriedJoin(''))],
  ['noCase']: ['no case', toNormalize(toLower, curriedJoin(' '))],
  ['paramCase']: ['param, case', toNormalize(toLower, curriedJoin(', '))],
  ['pascalCase']: ['PascalCase', toNormalize(capitalize, curriedJoin(''))],
  ['pathCase']: ['path/case', toNormalize(toLower, curriedJoin('/'))],
  ['snakeCase']: ['snake_case', toNormalize(toLower, curriedJoin('_'))],
  ['titleCase']: ['Title Case', toNormalize(capitalize, curriedJoin(' '))],
  ['upperKebabCase']: ['UPPER-KEBAB-CASE', toNormalize(toUpper, curriedJoin('-'))],
  ['upperSnakeCase']: ['UPPER_SNAKE_CASE', toNormalize(toUpper, curriedJoin('_'))],
  ['uppercase']: ['UPPERCASE', toNormalize(toUpper, curriedJoin(''))],
};

export default async function changeCase(textEditor: vscode.TextEditor) {
  const { selections, document } = textEditor;
  const wordCase = await vscode.window.showQuickPick(
    getKeys(wordTransformer).map(label => ({ description: wordTransformer[label][0], label })),
    { placeHolder: '选择单词格式' }
  );

  if (!wordCase) return;

  const [, transformer] = wordTransformer[wordCase.label];
  const unequalObject: UnequalObject = { keys: {}, rangeAndText: [[], []] };

  for (const { start, end, isEmpty } of selections) {
    for (const position of isEmpty ? [start] : [start, end]) {
      const range = document.getWordRangeAtPosition(position, /[\w\-]+/i);
      if (!range) continue;

      const { start, end } = range;
      const key = `${start.line}-${start.character} ${end.line}-${end.character}`;
      const text = document.getText(range);
      const transformedText = transformer(text);

      if (key in unequalObject.keys || text === transformedText) continue;

      unequalObject.keys[key] = undefined;
      unequalObject.rangeAndText[0].push(range);
      unequalObject.rangeAndText[1].push(transformedText);
    }
  }

  if (unequalObject.rangeAndText.flat().length === 0) return;

  await new Editor(document).replace(...unequalObject.rangeAndText).done();

  textEditor.selections = selections;

  vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
}
