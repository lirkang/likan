/**
 * @Author likan
 * @Date 2022/09/05 22:23:42
 * @Filepath likan/src/commands/change-case.ts
 */

import { capitalize, curryRight, join, lowerFirst, toLower, toUpper, unary, words } from 'lodash-es';

import Editor from '@/classes/Editor';

function toNormalize (mapCallback: (word: string) => string, callback: (words: Array<string>) => string) {
  return (text: string) => callback(words(text).map(unary(mapCallback)));
}

const curriedJoin: (separator: string) => (words: Array<string>) => string = curryRight(join);
const curriedCaseHandle = (caseHandle: (text: string) => string, separator: string) => (words: Array<string>) => caseHandle(curriedJoin(separator)(words));

const wordTransformer: Record<string, [string, (text: string) => string]> = {
  ['camelCase']: [ 'camelCase', toNormalize(capitalize, curriedCaseHandle(lowerFirst, '')) ],
  ['capitaCase']: [ 'CAPITAL CASE', toNormalize(toUpper, curriedJoin(' ')) ],
  ['dotCase']: [ 'dot.case', toNormalize(toLower, curriedJoin('.')) ],
  ['kebabCase']: [ 'kebab-case', toNormalize(toLower, curriedJoin('-')) ],
  ['lowercase']: [ 'lowercase', toNormalize(toLower, curriedJoin('')) ],
  ['noCase']: [ 'no case', toNormalize(toLower, curriedJoin(' ')) ],
  ['paramCase']: [ 'param, case', toNormalize(toLower, curriedJoin(', ')) ],
  ['pascalCase']: [ 'PascalCase', toNormalize(capitalize, curriedJoin('')) ],
  ['pathCase']: [ 'path/case', toNormalize(toLower, curriedJoin('/')) ],
  ['snakeCase']: [ 'snake_case', toNormalize(toLower, curriedJoin('_')) ],
  ['titleCase']: [ 'Title Case', toNormalize(capitalize, curriedJoin(' ')) ],
  ['upperKebabCase']: [ 'UPPER-KEBAB-CASE', toNormalize(toUpper, curriedJoin('-')) ],
  ['upperSnakeCase']: [ 'UPPER_SNAKE_CASE', toNormalize(toUpper, curriedJoin('_')) ],
  ['uppercase']: [ 'UPPERCASE', toNormalize(toUpper, curriedJoin('')) ],
};

export default async function changeCase (
  textEditor: vscode.TextEditor,
  edit: vscode.TextEditorEdit,
  modifyCase?: string,
) {
  const { selections, document } = textEditor;
  const wordCase =
    modifyCase ??
    (await vscode.window.showQuickPick(
      Object.keys(wordTransformer).map(label => ({ description: wordTransformer[label][0], label })),
      { placeHolder: '选择单词格式' },
    ));

  if (!wordCase) return;

  const character = Object.keys(Configuration.CHARACTERS);
  const characterString = character.filter(key => (<Record<string, boolean>>Configuration.CHARACTERS)[key]).join('');
  const [ , transformer ] = wordTransformer[typeof wordCase === 'string' ? wordCase : wordCase.label];
  const unequalObject = {
    keys: new Map<string, void>(),
    rangeAndText: <[Array<vscode.Range>, Array<string>]>[ [], [] ],
  };
  const positions = selections.flatMap(({ start, end, active }) => [ start, end, active ]);

  for (const position of positions) {
    const wordRange = document.getWordRangeAtPosition(position, new RegExp(`[\\w${characterString}]+`, 'i'));

    if (!wordRange) continue;

    const key = [ wordRange.start, wordRange.end ].flatMap(({ character, line }) => [ line, character ]).join('-');
    const text = document.getText(wordRange);
    const transformedText = transformer(text);

    if (unequalObject.keys.has(key) || text === transformedText) continue;

    unequalObject.keys.set(key);
    unequalObject.rangeAndText[0].push(wordRange);
    unequalObject.rangeAndText[1].push(transformedText);
  }

  if (unequalObject.rangeAndText.flat().length > 0)
    await new Editor(document).replace(...unequalObject.rangeAndText).done();

  textEditor.selections = selections;

  vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
}
