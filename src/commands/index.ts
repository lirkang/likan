/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import open from 'open';

import { FALSE } from '@/constants';
import { explorerTreeViewProvider, scriptTreeViewProvider } from '@/others';
import { openFolder } from '@/utils';

import insertComment from './insert.comment';
import scriptsRunner from './npm';
import tagsWrap from './tags.wrap';

const commandArray: Commands = [
  /** 在浏览器打开 */
  ['likan.open.browser', (uri: vscode.Uri) => open(uri.fsPath)],

  /** 包裹标签 */
  ['likan.language.wrap', tagsWrap],

  /** 运行脚本 */
  ['likan.other.scriptsRunner', scriptsRunner],

  /** 插入注释 */
  ['likan.language.comment', insertComment],

  /** 在当前窗口中打开文件夹。 */
  ['likan.open.currentWindow', (uri: vscode.Uri) => openFolder(uri)],

  /** 在新窗口中打开文件夹。 */
  ['likan.open.newWindow', (uri: vscode.Uri) => openFolder(uri, FALSE)],

  /** 刷新视图 */
  ['likan.refresh.script', scriptTreeViewProvider.refresh],

  /** 刷新视图 */
  ['likan.refresh.explorer', explorerTreeViewProvider.refresh],
];

const commands = commandArray.map(([command, handler]) => vscode.commands.registerCommand(command, handler));

export default commands;
