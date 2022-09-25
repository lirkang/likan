/**
 * @Author likan
 * @Date 2022/09/05 22:23:42
 * @Filepath src/commands/change-case.ts
 */

import { capitalize, curryRight, join, lowerFirst, toLower, toUpper, unary, words } from 'lodash-es';

import { getKeys } from '@/common/utils';

function toNormalize(mapCallback: (word: string) => string, callback: (words: Array<string>) => string) {
  return (text: string) => {
    return callback(words(text).map(unary(mapCallback)));
  };
}

const curriedJoin: (separator: string) => (words: Array<string>) => string = curryRight(join, 2);
const curriedLowerFirst = (words: Array<string>) => lowerFirst(curriedJoin('')(words));

const wordTransformer: Record<string, [string, (text: string) => string]> = {
  ['camelCase']: ['camelCase', toNormalize(capitalize, curriedLowerFirst)],
  ['capitaCase']: ['CAPITAL CASE', toNormalize(toUpper, curriedJoin(' '))],
  ['dotCase']: ['dot/case', toNormalize(toLower, curriedJoin('.'))],
  ['kebabCase']: ['kebab-case', toNormalize(toLower, curriedJoin('-'))],
  ['lowercase']: ['lowercase', toNormalize(toLower, curriedJoin(''))],
  ['noCase']: ['no case', toNormalize(toLower, curriedJoin(' '))],
  ['pascalCase']: ['PascalCase', toNormalize(capitalize, curriedJoin(''))],
  ['pathCase']: ['path/case', toNormalize(toLower, curriedJoin('/'))],
  ['snakeCase']: ['snake_case', toNormalize(toLower, curriedJoin('_'))],
  ['titleCase']: ['Title Case', toNormalize(capitalize, curriedJoin(' '))],
  ['upperKebabCase']: ['UPPER-KEBAB-CASE', toNormalize(toUpper, curriedJoin('-'))],
  ['upperSnakeCase']: ['UPPER_SNAKE_CASE', toNormalize(toUpper, curriedJoin('_'))],
  ['uppercase']: ['UPPERCASE', toNormalize(toUpper, curriedJoin(''))],
};

export default async function changeCase({ document, selections, edit }: vscode.TextEditor) {
  if (selections.length === 0) return;

  const wordCase = await vscode.window.showQuickPick(
    getKeys(wordTransformer).map(label => ({ description: wordTransformer[label][0], label })),
    { placeHolder: '选择单词格式' }
  );

  if (!wordCase) return;

  const transformer = wordTransformer[wordCase.label][1];
  const rangeMap = new Map<string, vscode.Range>();

  for (const { isSingleLine, active } of selections) {
    if (!isSingleLine) continue;

    const wordRange = document.getWordRangeAtPosition(active, /[\w\-]+/i);

    if (!wordRange) continue;

    const { start, end } = wordRange;
    const key = `${start.line}-${start.character} ${end.line}-${end.character}`;

    if (rangeMap.has(key)) continue;

    rangeMap.set(key, wordRange);
  }

  await edit(
    editBuilder => {
      for (const [, range] of rangeMap) {
        editBuilder.delete(range);
        editBuilder.insert(range.start, transformer(document.getText(range)));
      }
    },
    { undoStopAfter: false, undoStopBefore: false }
  );
}
