/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import scriptTreeViewProvider from '@/classes/ScriptTreeViewProvider';
import { FALSE } from '@/common/constants';
import { openFolder } from '@/common/utils';

import changeCase from './change-case';
import deleteQuotes from './delete-quotes';
import gitignore from './gitignore';
import insertComment from './insert-comment';
import scriptsRunner from './npm';
import { openDefaultBrowser, openSpecifyBrowser } from './open-browser';
import tagsWrap from './tags-wrap';
import trimWhitespace from './trim-whitespace';
const commandArray: Common.Commands = [
  // 包裹标签
  ['likan.language.wrap', tagsWrap],

  // 运行脚本
  ['likan.other.scriptsRunner', scriptsRunner],

  // 插入注释
  ['likan.language.comment', insertComment],

  // 在浏览器打开
  ['likan.open.defaultBrowser', openDefaultBrowser],

  // 在浏览器打开
  ['likan.open.specifyBrowser', openSpecifyBrowser],

  // 在当前窗口中打开文件夹。
  ['likan.open.currentWindow', openFolder],

  // 在新窗口中打开文件夹。
  ['likan.open.newWindow', (uri: vscode.Uri) => openFolder(uri, FALSE)],

  // 刷新视图
  ['likan.refresh.script', scriptTreeViewProvider.refresh],

  // 刷新视图
  ['likan.refresh.explorer', explorerTreeViewProvider.refresh],

  // 清空左侧空白
  ['likan.other.trimWhitespace', trimWhitespace],

  // 添加gitignore
  ['likan.other.gitignore', gitignore],

  // 删除离光标最近的一组括号对
  ['likan.other.deleteQuote', deleteQuotes],

  // change-Case
  ['likan.other.changeCase', changeCase],

  [
    'likan.open.explorer',
    ({ fsPath }: vscode.Uri) => {
      child_process.exec(`explorer.exe /select, "${fsPath}"`);
    },
  ],
];

const commands = commandArray.map(([command, handler]) => vscode.commands.registerCommand(command, handler));

export default commands;
