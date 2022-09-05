/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import open from 'open';

import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import scriptTreeViewProvider from '@/classes/ScriptTreeViewProvider';
import { BROWSERS, FALSE, TRUE } from '@/common/constants';
import { getKeys, openFolder, thenableToPromise } from '@/common/utils';

import insertComment from './insert-comment';
import scriptsRunner from './npm';
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
  ['likan.open.defaultBrowser', ({ fsPath }: vscode.Uri) => open(fsPath)],

  // 在浏览器打开
  [
    'likan.open.specifyBrowser',
    async ({ fsPath }: vscode.Uri) => {
      const browser = await thenableToPromise(vscode.window.showQuickPick(getKeys(BROWSERS), { canPickMany: TRUE }));

      await Promise.all(browser.map(key => open(fsPath, { app: { name: BROWSERS[key] } })));
    },
  ],

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
];

const commands = commandArray.map(([command, handler]) => vscode.commands.registerCommand(command, handler));

export default commands;
