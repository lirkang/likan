/**
 * @Author likan
 * @Date 2022-08-07 20:07:23
 * @FilePath D:\CodeSpace\Dev\likan\src\others\index.ts
 */

import { fileSize, memory } from './statusbar';
import { changeConfig, changeEditor, createFiles, saveText, treeView } from './vscode';

export const listeners = [changeEditor, changeConfig, saveText, createFiles, treeView];
export const statusbarItems = [fileSize, memory];
