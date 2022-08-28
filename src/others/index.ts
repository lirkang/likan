/**
 * @Author likan
 * @Date 2022-08-07 20:07:23
 * @FilePath D:\CodeSpace\Dev\likan\src\others\index.ts
 */

import { fileSize, memory } from './statusbar';
import { changeConfig, changeEditor, createFiles, explorerTreeView, saveText, scriptsTreeView } from './vscode';

export const listeners = [changeEditor, changeConfig, saveText, createFiles, scriptsTreeView, explorerTreeView];
export const statusbarItems = [fileSize, memory];
export * from './statusbar';
export * from './vscode';
