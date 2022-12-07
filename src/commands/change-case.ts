/**
 * @Author likan
 * @Date 2022/09/05 22:23:42
 * @Filepath likan/src/commands/change-case.ts
 */

import { capitalize, curryRight, join, lowerFirst, toLower, toUpper, unary, words } from 'lodash-es';

import Editor from '@/classes/Editor';

function normalizeWords (mapCallback: (word: string) => string, callback: (words: Array<string>) => string) {
  return (text: string) => callback(words(text).map(unary(mapCallback)));
}

const stringJoin: (separator: string) => (words: Array<string>) => string = curryRight(join);
const specialHandler = (caseHandle: (text: string) => string, separator: string) => (words: Array<string>) => caseHandle(stringJoin(separator)(words));

const wordTransformers: Record<string, [string, (text: string) => string]> = {
  ['camelCase']: [ 'camelCase', normalizeWords(capitalize, specialHandler(lowerFirst, '')) ],
  ['capitaCase']: [ 'CAPITAL CASE', normalizeWords(toUpper, stringJoin(' ')) ],
  ['dotCase']: [ 'dot.case', normalizeWords(toLower, stringJoin('.')) ],
  ['kebabCase']: [ 'kebab-case', normalizeWords(toLower, stringJoin('-')) ],
  ['lowercase']: [ 'lowercase', normalizeWords(toLower, stringJoin('')) ],
  ['noCase']: [ 'no case', normalizeWords(toLower, stringJoin(' ')) ],
  ['paramCase']: [ 'param, case', normalizeWords(toLower, stringJoin(', ')) ],
  ['pascalCase']: [ 'PascalCase', normalizeWords(capitalize, stringJoin('')) ],
  ['pathCase']: [ 'path/case', normalizeWords(toLower, stringJoin('/')) ],
  ['snakeCase']: [ 'snake_case', normalizeWords(toLower, stringJoin('_')) ],
  ['titleCase']: [ 'Title Case', normalizeWords(capitalize, stringJoin(' ')) ],
  ['upperKebabCase']: [ 'UPPER-KEBAB-CASE', normalizeWords(toUpper, stringJoin('-')) ],
  ['upperSnakeCase']: [ 'UPPER_SNAKE_CASE', normalizeWords(toUpper, stringJoin('_')) ],
  ['uppercase']: [ 'UPPERCASE', normalizeWords(toUpper, stringJoin('')) ],
};

const wordTransformerList = Object.keys(wordTransformers).map(label => ({
  description: wordTransformers[label][0],
  label,
}));

export default async function changeCase (
  textEditor: vscode.TextEditor,
  edit: vscode.TextEditorEdit,
  caseFromCmd?: string,
) {
  const { selections, document } = textEditor;

  let wordTransformer = caseFromCmd;

  if (!wordTransformer) {
    const transformer = await vscode.window.showQuickPick(wordTransformerList, { placeHolder: '选择格式' });

    wordTransformer = transformer?.label;
  }

  if (!wordTransformer) return;

  const character = Object.keys(Configuration.CHARACTERS);
  const [ , transformer ] = wordTransformers[wordTransformer];
  const textRangeMap = { keys: new Map<string, void>(), rangeAndText: <[Array<vscode.Range>, Array<string>]>[ [], [] ] };
  const [ ranges, texts ] = textRangeMap.rangeAndText;
  const regexpString = character.filter(key => (<Record<string, boolean>>Configuration.CHARACTERS)[key]).join('');

  for (const selection of selections) {
    const range = selection.isEmpty
      ? document.getWordRangeAtPosition(selection.active, new RegExp(`[\\w${regexpString}]+`, 'i'))
      : selection;

    if (!range) continue;

    const key = [ range.start, range.end ].flatMap(({ character, line }) => [ line, character ]).join('-');
    const text = document.getText(range);
    const transformedText = transformer(text);

    if (textRangeMap.keys.has(key) || text === transformedText) continue;

    textRangeMap.keys.set(key);

    ranges.push(range);
    texts.push(transformedText);
  }

  await new Editor(document).replace(...textRangeMap.rangeAndText).done();
  await vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
}
