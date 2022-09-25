/**
 * @Author likan
 * @Date 2022/09/06 10:54:35
 * @Filepath src/common/context.ts
 */

import { LANGUAGES } from './constants';

vscode.commands.executeCommand('setContext', 'likan.htmlId', ['html', 'htm']);
vscode.commands.executeCommand('setContext', 'likan.languageId', LANGUAGES);
vscode.commands.executeCommand('setContext', 'likan.wrapId', [...LANGUAGES, 'html', 'htm', 'svg', 'xml', 'vue']);

export {};
