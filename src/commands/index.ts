/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @Filepath likan/src/commands/index.ts
 */

import { curry, curryRight, forEach, unary } from 'lodash-es';
import open from 'open';
import { URI } from 'vscode-uri';

import { explorerTreeView } from '@/common/providers';
import { exists } from '@/common/utils';

import changeCase from './change-case';
import gitignore from './gitignore';
import insertComment from './insert-comment';
import packageScript from './package-script';
import scriptRunner from './script-runner';
import tagsWrap from './tags-wrap';

const openFolder = async (uri: vscode.Uri, flag: boolean) => {
  if (URI.isUri(uri) && exists(uri)) {
    return await vscode.commands.executeCommand('vscode.openFolder', uri, flag);
  } else if (!uri && explorerTreeView.selection.length >= 2) {
    forEach(explorerTreeView.selection, unary(curryRight(openFolder)(flag)));
  }
};

const openDefaultBrowserHandler = (uri = vscode.window.activeTextEditor?.document.uri) =>
  URI.isUri(uri) && open(uri.fsPath);

const addToWorkspaceHandler = (uri: vscode.Uri) =>
  vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders?.length ?? 0, 0, { uri });

const commands = [
  // 包裹标签
  vscode.commands.registerTextEditorCommand('likan.language.wrap', tagsWrap),

  // 插入注释
  vscode.commands.registerTextEditorCommand('likan.language.comment', insertComment),

  // change-case
  vscode.commands.registerTextEditorCommand('likan.other.changeCase', changeCase),

  // 删除离光标最近的括号对
  // vscode.commands.registerTextEditorCommand('', () => {}),

  // 运行脚本
  vscode.commands.registerCommand('likan.other.scriptRunner', scriptRunner),

  // 在浏览器打开
  vscode.commands.registerCommand('likan.open.defaultBrowser', openDefaultBrowserHandler),

  // 在当前窗口中打开文件夹。
  vscode.commands.registerCommand('likan.open.currentWindow', curry(openFolder)(curry.placeholder, false)),

  // 在新窗口中打开文件夹。
  vscode.commands.registerCommand('likan.open.newWindow', curry(openFolder)(curry.placeholder, true)),

  // 添加.gitignore
  vscode.commands.registerCommand('likan.other.gitignore', gitignore),

  // 查找脚本运行
  vscode.commands.registerCommand('likan.other.packageScript', packageScript),

  // 添加到工作区
  vscode.commands.registerCommand('likan.other.addToWorkspace', addToWorkspaceHandler),
];

export default commands;
