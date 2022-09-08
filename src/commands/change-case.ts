/**
 * @Author Likan
 * @Date 2022/09/05 22:23:42
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\change-case.ts
 */

import { EMPTY_STRING, UNDEFINED } from '@/common/constants';
import { getKeys } from '@/common/utils';

function normalizeString(
  singleWordMode: 'toLowerCase' | 'toUpperCase' = 'toLowerCase',
  singleWordFirstMode: 'toLowerCase' | 'toUpperCase' = 'toUpperCase',
  separator = EMPTY_STRING,
  firstWordCase: 'toLowerCase' | 'toUpperCase' = 'toUpperCase'
) {
  return (text: string) =>
    text
      .replaceAll(/[\W_]+/g, ' ')
      .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
      .replaceAll(/[\d\s]+/g, s => ` ${s.replaceAll(' ', EMPTY_STRING)} `)
      .split(' ')
      .filter(Boolean)
      .map(string => string[singleWordMode]().replace(/./, s => s[singleWordFirstMode]()))
      .join(separator)
      .replace(/./, s => s[firstWordCase]());
}

const wordTransformer: Record<string, (text: string) => string> = {
  ['CAPITAL CASE']: normalizeString('toUpperCase', UNDEFINED, ' '),
  ['PascalCase']: normalizeString(),
  ['Title Case']: normalizeString(UNDEFINED, 'toUpperCase', ' '),
  ['UPPER-KEBAB-CASE']: normalizeString('toUpperCase', 'toUpperCase', '-'),
  ['UPPERCASE']: normalizeString('toUpperCase'),
  ['UPPER_SNAKE_CASE']: normalizeString('toUpperCase', 'toUpperCase', '_'),
  ['camelCase']: normalizeString(UNDEFINED, UNDEFINED, UNDEFINED, 'toLowerCase'),
  ['kebab-case']: normalizeString(UNDEFINED, 'toLowerCase', '-', 'toLowerCase'),
  ['lowercase']: normalizeString(UNDEFINED, 'toLowerCase', UNDEFINED, 'toLowerCase'),
  ['no case']: normalizeString(UNDEFINED, 'toLowerCase', ' ', 'toLowerCase'),
  ['snake_case']: normalizeString(UNDEFINED, 'toLowerCase', '_', 'toLowerCase'),
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

    const transformText = wordTransformer[wordCase](replaceText);

    await edit(editor => {
      editor.delete(wordRange);
      editor.insert(wordRange.start, transformText);
    });
  }
}
