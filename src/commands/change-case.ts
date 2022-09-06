/**
 * @Author Likan
 * @Date 2022/09/05 22:23:42
 * @FilePath D:\CodeSpace\Dev\likan\src\commands\change-case.ts
 */

import { getKeys, toFirstUpper, uniq } from '@/common/utils';

function normalizeString(text: string, mode: 'toLowerCase' | 'toUpperCase' = 'toLowerCase') {
  return text
    .replace(/[_\-]+/g, () => ' ')
    .replace(/[a-z][A-Z]/g, ([first, second]) => `${first} ${second}`)
    .split(' ')
    .map(string => string.toLowerCase().replace(/./, s => s[mode]()));
}

// GetData
function camelCase(text: string) {
  return normalizeString(text, 'toUpperCase').join('');
}

// getData
function lowerCamelCase(text: string) {
  return normalizeString(text, 'toLowerCase')
    .map(element => toFirstUpper(element))
    .join('')
    .replace(/./, s => s.toLowerCase());
}

// get_data
function snakeCase(text: string) {
  return normalizeString(text, 'toLowerCase').join('_');
}

// get-data
function kebabCase(text: string) {
  return normalizeString(text, 'toLowerCase').join('-');
}

function upperSnakeCase(text: string) {
  return normalizeString(text, 'toLowerCase')
    .map(element => element.toUpperCase())
    .join('_');
}

function upperKebabCase(text: string) {
  return normalizeString(text, 'toLowerCase')
    .map(element => element.toUpperCase())
    .join('-');
}

const wordTransformer: Record<string, (text: string) => string> = {
  camelCase,
  kebabCase,
  lowerCamelCase,
  snakeCase,
  upperKebabCase,
  upperSnakeCase,
} as const;

export default async function changeCase() {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) return;

  const { selections, edit, document, insertSnippet } = activeTextEditor;

  if (selections.length === 0) return;

  let wordRanges: Array<vscode.Range> = [];
  let replaceTexts: Array<string> = [];

  for (const { active } of selections) {
    const wordRange = document.getWordRangeAtPosition(active, /[\w\-]+/);

    if (!wordRange) continue;

    const replaceText = document.getText(wordRange);

    wordRanges.push(wordRange);
    replaceTexts.push(replaceText);
  }

  const wordCase = await vscode.window.showQuickPick(getKeys(wordTransformer));

  if (!wordCase) return;

  const [filteredArray, indexes] = uniq(wordRanges, ['start', 'end']);

  wordRanges = filteredArray;
  replaceTexts = replaceTexts.filter((_, index) => !indexes.includes(index));

  await edit(async editor => {
    for (const [index, range] of wordRanges.entries()) {
      editor.replace(range, wordTransformer[wordCase](replaceTexts[index]));
    }
  });

  insertSnippet(new vscode.SnippetString(''));
}
