/**
 * @Author likan
 * @Date 2022/8/15 23:03:30
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\index.ts
 */

import { JAVASCRIPT_REGEXP, JSON_REGEXP, LANGUAGES, PACKAGE_JSON } from '@/constants';

import {
  LanguageEnvCompletionProvider,
  LanguagePathCompletionProvider,
  LanguagePathJumpDefinitionProvider,
} from './javascript';
import { LanguageDepsDefinitionProvider } from './json';

vscode.languages.registerDefinitionProvider(LANGUAGES, new LanguagePathJumpDefinitionProvider());
vscode.languages.registerDefinitionProvider(
  { language: 'json', pattern: `**/${PACKAGE_JSON}` },
  new LanguageDepsDefinitionProvider()
);

vscode.languages.registerCompletionItemProvider(LANGUAGES, new LanguageEnvCompletionProvider(), '.');

vscode.languages.setLanguageConfiguration('json', { wordPattern: JSON_REGEXP });

if (process.env.NODE_ENV === 'development') {
  // LANGUAGES.forEach(l => vscode.languages.setLanguageConfiguration(l, { wordPattern: JAVASCRIPT_REGEXP }));
  vscode.languages.registerCompletionItemProvider(LANGUAGES, new LanguagePathCompletionProvider(), '/');
}
