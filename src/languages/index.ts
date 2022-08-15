/**
 * @Author likan
 * @Date 2022/8/15 23:03:30
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\index.ts
 */

import { languages } from 'vscode';

import { JSON_REGEXP, LANGUAGES, PACKAGE_JSON } from '@/constants';

import {
  LanguageEnvCompletionProvider,
  LanguagePathCompletionProvider,
  LanguagePathJumpDefinitionProvider,
} from './javascript';
import { LanguageDepsDefinitionProvider } from './json';

languages.registerDefinitionProvider(LANGUAGES, new LanguagePathJumpDefinitionProvider());
languages.registerDefinitionProvider(
  { language: 'json', pattern: `**/${PACKAGE_JSON}` },
  new LanguageDepsDefinitionProvider()
);

languages.registerCompletionItemProvider(LANGUAGES, new LanguageEnvCompletionProvider(), '.');
// languages.registerCompletionItemProvider(LANGUAGES, new LanguagePathCompletionProvider(), '/');

languages.setLanguageConfiguration('json', { wordPattern: JSON_REGEXP });
// LANGUAGES.forEach(l => languages.setLanguageConfiguration(l, { wordPattern: JAVASCRIPT_REGEXP }));
