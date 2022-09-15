/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import { openFolder } from '@/common/utils';

import addToWorkspace from './add-to-workspace';
import changeCase from './change-case';
import gitignore from './gitignore';
import insertComment from './insert-comment';
import packageScript from './package-script';
import scriptRunner from './script-runner';
import tagsWrap from './tags-wrap';
import trimWhitespace from './trim-whitespace';

const commandArray: Common.Commands = [
  // 包裹标签
  ['likan.language.wrap', tagsWrap, 'registerTextEditorCommand'],

  // 运行脚本
  ['likan.other.scriptRunner', scriptRunner],

  // 插入注释
  ['likan.language.comment', insertComment, 'registerTextEditorCommand'],

  // 在浏览器打开
  ['likan.open.defaultBrowser', (uri = vscode.window.activeTextEditor?.document.uri) => vscode.env.openExternal(uri)],

  // 在当前窗口中打开文件夹。
  ['likan.open.currentWindow', (uri: vscode.Uri) => openFolder(uri, false)],

  // 在新窗口中打开文件夹。
  ['likan.open.newWindow', (uri: vscode.Uri) => openFolder(uri, true)],

  // 刷新视图
  ['likan.refresh.explorer', explorerTreeViewProvider.refresh],

  // 清空左侧空白
  ['likan.other.trimWhitespace', trimWhitespace, 'registerTextEditorCommand'],

  // 添加gitignore
  ['likan.other.gitignore', gitignore],

  // change-Case
  ['likan.other.changeCase', changeCase, 'registerTextEditorCommand'],

  // 查找脚本运行
  ['likan.other.packageScript', packageScript],

  // 添加到工作区
  ['likan.other.addToWorkspace', addToWorkspace],
];

const commands = commandArray.map(([command, handler, type = 'registerCommand']) =>
  vscode.commands[type](command, handler)
);

export default commands;
