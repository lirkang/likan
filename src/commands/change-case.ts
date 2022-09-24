/**
 * @Author likan
 * @Date 2022/09/05 22:23:42
 * @Filepath E:/TestSpace/extension/likan/src/commands/change-case.ts
 */

import { unary, words } from 'lodash-es';

import { getKeys } from '@/common/utils';

function normalizeString(
  mapCallback = (string: string) => string.toLowerCase(),
  callback: (normalizedString: Array<string>) => string
) {
  return (text: string) => {
    return callback(words(text).map(unary(mapCallback)));
  };
}

function firstToLower(string: string) {
  return string.replace(/./, string_ => string_.toLowerCase());
}

function firstToUpperCase(string: string) {
  return string.replace(/./, string_ => string_.toUpperCase());
}

function toUpperCase(string: string) {
  return string.toUpperCase();
}

function returnItself<T>(parameter: T): T {
  return parameter;
}

const wordTransformer: Record<string, (text: string) => string> = {
  ['camelCase camelCase']: normalizeString(firstToUpperCase, string => firstToLower(string.join(''))),

  ['capitaCase CAPITAL CASE']: normalizeString(toUpperCase, string => string.join(' ')),

  ['kebabCase kebab-case']: normalizeString(returnItself, string => string.join('-')),

  ['lowercase lowercase']: normalizeString(returnItself, string => string.join('')),

  ['noCase no case']: normalizeString(returnItself, string => string.join(' ')),

  ['pascalCase PascalCase']: normalizeString(firstToUpperCase, string => string.join('')),

  ['snakeCase snake_case']: normalizeString(returnItself, string => string.join('_')),

  ['titleCase Title Case']: normalizeString(firstToUpperCase, string => string.join(' ')),

  ['upperKebabCase UPPER-KEBAB-CASE']: normalizeString(toUpperCase, string => string.join('-')),

  ['upperSnakeCase UPPER_SNAKE_CASE']: normalizeString(toUpperCase, string => string.join('_')),

  ['uppercase UPPERCASE']: normalizeString(toUpperCase, string => string.join('')),
};

export default async function changeCase({ document, selections, edit }: vscode.TextEditor) {
  if (selections.length === 0) return;

  const wordCase = await vscode.window.showQuickPick(getKeys(wordTransformer));

  if (!wordCase) return;

  const rangeMap = new Map<string, vscode.Range>();

  for (const { isSingleLine, active } of selections) {
    if (!isSingleLine) continue;

    const wordRange = document.getWordRangeAtPosition(active, /[\w\-]+/i);

    if (!wordRange) continue;

    const key = `${wordRange.start.line}-${wordRange.start.character} ${wordRange.end.line}-${wordRange.end.character}`;

    if (rangeMap.has(key)) continue;

    rangeMap.set(key, wordRange);
  }

  await edit(
    editBuilder => {
      for (const [, range] of rangeMap) {
        editBuilder.delete(range);
        editBuilder.insert(range.start, wordTransformer[wordCase](document.getText(range)));
      }
    },
    { undoStopAfter: false, undoStopBefore: false }
  );
}
