/**
 * @Author likan
 * @Date 2022/8/15 23:03:30
 * @FilePath D:\CodeSpace\Dev\likan\src\languages\index.ts
 */

import { JAVASCRIPT_WARD_PATTERN, JSON_WORD_PATTERN, LANGUAGES, PACKAGE_JSON } from '@/constants';

import { EnvProvider, JumpProvider, LinkedEditingProvider } from './javascript';
import { DepJumpProvider } from './json';

vscode.languages.registerDefinitionProvider(LANGUAGES.concat('vue', 'json'), new JumpProvider());
vscode.languages.registerDefinitionProvider({ language: 'json', pattern: `**/${PACKAGE_JSON}` }, new DepJumpProvider());

vscode.languages.registerCompletionItemProvider(LANGUAGES.concat('vue'), new EnvProvider(), '.', "'");

vscode.languages.setLanguageConfiguration('json', { wordPattern: JSON_WORD_PATTERN });
vscode.languages.setLanguageConfiguration('javascript', { wordPattern: JAVASCRIPT_WARD_PATTERN });
vscode.languages.setLanguageConfiguration('typescript', { wordPattern: JAVASCRIPT_WARD_PATTERN });
vscode.languages.setLanguageConfiguration('javascriptreact', { wordPattern: JAVASCRIPT_WARD_PATTERN });
vscode.languages.setLanguageConfiguration('typescriptreact', { wordPattern: JAVASCRIPT_WARD_PATTERN });
vscode.languages.setLanguageConfiguration('vue', { wordPattern: JAVASCRIPT_WARD_PATTERN });

vscode.languages.registerLinkedEditingRangeProvider(LANGUAGES.concat('vue'), new LinkedEditingProvider());
