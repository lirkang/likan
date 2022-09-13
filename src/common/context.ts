/**
 * @Author Likan
 * @Date 2022/09/06 10:54:35
 * @FilePath E:\TestSpace\extension\likan\src\common\context.ts
 */

import { LANGUAGES } from './constants';

vscode.commands.executeCommand('setContext', 'likan.htmlId', ['html', 'htm']);
vscode.commands.executeCommand('setContext', 'likan.languageId', LANGUAGES);
vscode.commands.executeCommand('setContext', 'likan.wrapId', [...LANGUAGES, 'html', 'htm', 'svg', 'xml', 'vue']);
vscode.commands.executeCommand('setContext', 'likan.convertString', [...LANGUAGES, 'html', 'vue']);

export {};
