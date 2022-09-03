/**
 * @Author likan
 * @Date 2022/8/15 23:03:30
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\index.ts
 */

import { JAVASCRIPT_WARD_PATTERN as wordPattern, LANGUAGES } from '@/constants';

import { EnvironmentProvider, JumpProvider, LinkedEditingProvider } from './javascript';

const languages = [
  vscode.languages.registerDefinitionProvider([...LANGUAGES, 'vue', 'json'], new JumpProvider()),
  vscode.languages.registerCompletionItemProvider([...LANGUAGES, 'vue'], new EnvironmentProvider(), '.', "'"),
  ...[...LANGUAGES, 'vue', 'json'].map(l => vscode.languages.setLanguageConfiguration(l, { wordPattern })),
  vscode.languages.registerLinkedEditingRangeProvider([...LANGUAGES, 'vue', 'xml', 'svg'], new LinkedEditingProvider()),
];

export default languages;
export * from './javascript';
