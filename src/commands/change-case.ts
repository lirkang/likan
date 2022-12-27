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

const joinWithSeparator: (separator: string) => (words: Array<string>) => string = curryRight(join);

const camelCaseHandler = (caseHandle: (text: string) => string, separator: string) => (words: Array<string>) => caseHandle(joinWithSeparator(separator)(words));

const wordTransformers: Record<string, (text: string) => string> = {
  ['Camel Case']: normalizeWords(capitalize, camelCaseHandler(lowerFirst, '')),
  ['Capita Case']: normalizeWords(toUpper, joinWithSeparator(' ')),
  ['Dot Case']: normalizeWords(toLower, joinWithSeparator('.')),
  ['Kebab Case']: normalizeWords(toLower, joinWithSeparator('-')),
  ['Lower Case']: normalizeWords(toLower, joinWithSeparator('')),
  ['No Case']: normalizeWords(toLower, joinWithSeparator(' ')),
  ['Param Case']: normalizeWords(toLower, joinWithSeparator(', ')),
  ['Pascal Case']: normalizeWords(capitalize, joinWithSeparator('')),
  ['Path Case']: normalizeWords(toLower, joinWithSeparator('/')),
  ['Snake Case']: normalizeWords(toLower, joinWithSeparator('_')),
  ['Title Case']: normalizeWords(capitalize, joinWithSeparator(' ')),
  ['Upper Case']: normalizeWords(toUpper, joinWithSeparator('')),
  ['Upper Kebab Case']: normalizeWords(toUpper, joinWithSeparator('-')),
  ['Upper Snake Case']: normalizeWords(toUpper, joinWithSeparator('_')),
};

export default async function changeCase (
  textEditor: vscode.TextEditor,
  edit: vscode.TextEditorEdit,
  caseFromConfig?: string,
) {
  const { selections, document } = textEditor;
  const wordTransformer =
    caseFromConfig ?? (await vscode.window.showQuickPick(Object.keys(wordTransformers), { placeHolder: '选择格式' }));

  if (!wordTransformer) return;

  const transformer = wordTransformers[wordTransformer];
  const textRangeMap = { keys: new Map<string, void>(), rangeAndText: <[Array<vscode.Range>, Array<string>]>[ [], [] ] };
  const [ ranges, texts ] = textRangeMap.rangeAndText;

  for (const selection of selections) {
    const range = selection.isEmpty ? document.getWordRangeAtPosition(selection.active) : selection;

    if (!range) continue;

    const key = [ range.start, range.end ].flatMap(({ character, line }) => [ line, character ]).join('-');
    const text = document.getText(range);
    const transformedText = transformer(text);

    if (textRangeMap.keys.has(key) || text === transformedText) continue;

    textRangeMap.keys.set(key);

    ranges.push(range);
    texts.push(transformedText);
  }

  await new Editor(document.uri).replace(...textRangeMap.rangeAndText).apply();
  await vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
}
