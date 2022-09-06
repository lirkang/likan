/**
 * @Author Likan
 * @Date 2022/09/05 22:23:42
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\change-case.ts
 */

import { UNDEFINED } from '@/common/constants';
import { getKeys } from '@/common/utils';

function normalizeString(
  text: string,
  singleWordMode: 'toLowerCase' | 'toUpperCase' = 'toLowerCase',
  singleWordFirstMode: 'toLowerCase' | 'toUpperCase' = 'toUpperCase',
  separator = ''
) {
  return text
    .replaceAll(/[_\-]+/g, () => ' ')
    .replaceAll(/[a-z][A-Z]/g, ([first, second]) => `${first} ${second}`)
    .replaceAll(/\d+/g, s => ` ${s} `)
    .split(' ')
    .filter(s => s.length)
    .map(string => string[singleWordMode]().replace(/./, s => s[singleWordFirstMode]()))
    .join(separator);
}

// GetData
function pascalCase(text: string) {
  return normalizeString(text);
}

// getData
function camelCase(text: string) {
  return normalizeString(text).replace(/./, s => s.toLowerCase());
}

// get_data
function snakeCase(text: string) {
  return normalizeString(text, UNDEFINED, 'toLowerCase', '_');
}

// get-data
function kebabCase(text: string) {
  return normalizeString(text, UNDEFINED, 'toLowerCase', '-');
}

// GET_DATA
function upperSnakeCase(text: string) {
  return normalizeString(text, 'toUpperCase', 'toUpperCase', '_');
}

// GET-DATA
function upperKebabCase(text: string) {
  return normalizeString(text, 'toUpperCase', 'toUpperCase', '-');
}

const wordTransformer: Record<string, (text: string) => string> = {
  ['PascalCase']: pascalCase,
  ['UPPER-KEBAB-CASE']: upperKebabCase,
  ['UPPER_KEBAB_CASE']: upperSnakeCase,
  camelCase,
  ['kebab-case']: kebabCase,
  ['snake_case']: snakeCase,
} as const;

export default async function changeCase() {
  if (!vscode.window?.activeTextEditor) return;

  const wordCase = await vscode.window.showQuickPick(getKeys(wordTransformer).sort());

  if (!wordCase) return;

  const { selections, edit, document } = vscode.window.activeTextEditor;

  if (selections.length === 0) return;

  for await (const { isSingleLine, active } of selections) {
    if (!isSingleLine) continue;

    const wordRange = document.getWordRangeAtPosition(active, /[\w\-]+/i);
    const replaceText = document.getText(wordRange);

    if (!wordRange || !replaceText) continue;

    await edit(editor => {
      editor.delete(wordRange);
      editor.insert(wordRange.start, wordTransformer[wordCase](replaceText));
    });
  }
}
