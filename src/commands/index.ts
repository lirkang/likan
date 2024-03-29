/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @Filepath likan/src/commands/index.ts
 */

import { curryRight, forEach, unary } from 'lodash-es';
import open from 'open';

import explorerTreeViewProvider from '@/classes/ExplorerTreeViewProvider';
import { exist } from '@/common/utils';

import changeCase from './change-case';
import gitignore from './gitignore';
import insertComment from './insert-comment';
import packageScript from './package-script';
import scriptRunner from './script-runner';
import tagsWrap from './tags-wrap';

const openFolder = (uri: vscode.Uri, flag: boolean) => {
  if (exist(uri)) vscode.commands.executeCommand('vscode.openFolder', uri, flag);
};

const openInDefaultBrowser = (uri = vscode.window.activeTextEditor?.document.uri) =>
  uri && exist(uri) && open(uri.fsPath);

const addToWorkspace = (uri: vscode.Uri | Array<vscode.Uri>) => {
  if (Array.isArray(uri)) forEach(uri, unary(addToWorkspace));
  else if (exist(uri))
    vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length ?? 0, 0, { uri });
};

const _openFolder = (bool: boolean) => unary(curryRight(openFolder)(bool));

const commands = [
  // 包裹标签
  vscode.commands.registerTextEditorCommand('likan.language.wrap', tagsWrap),

  // 插入注释
  vscode.commands.registerTextEditorCommand('likan.language.comment', insertComment),

  // change-case
  vscode.commands.registerTextEditorCommand('likan.other.changeCase', changeCase),

  // 运行脚本
  vscode.commands.registerCommand('likan.other.scriptRunner', scriptRunner),

  // 在浏览器打开
  vscode.commands.registerCommand('likan.open.defaultBrowser', openInDefaultBrowser),

  // 在当前窗口中打开文件夹。
  vscode.commands.registerCommand('likan.open.currentWindow', _openFolder(false)),

  // 在新窗口中打开文件夹。
  vscode.commands.registerCommand('likan.open.newWindow', _openFolder(true)),

  // 添加.gitignore
  vscode.commands.registerCommand('likan.other.gitignore', gitignore),

  // 查找脚本运行
  vscode.commands.registerCommand('likan.other.packageScript', packageScript),

  // 添加到工作区
  vscode.commands.registerCommand('likan.other.addToWorkspace', addToWorkspace),

  // 刷新视图
  vscode.commands.registerCommand('likan.other.refresh', explorerTreeViewProvider.refresh),
];

export default commands;
