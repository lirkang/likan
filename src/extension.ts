/**
 *
 * @Author likan
 * @Date 2022-05-02 17:25:36
 * @FileName extension.ts
 * @Software Visual Studio Code
 */

import * as vscode from 'vscode'
import { comment } from './command/comment'
import { htmlWrap } from './command/html-wrap'
import {
  changePackageByVersion,
  installPackage,
  npmRun,
  npmSelect,
  npmStart,
  uninstallPackage
} from './command/npm'
import { openBrowser } from './command/open-browser'
import { openInCurrentWindow, openInNewWindow } from './command/open-window'
import { terminal } from './command/terminal'
// import './other/codelens'
import './statusBar'

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    /**
     * 生成注释
     */
    vscode.commands.registerCommand('likan.comment', comment),

    /**
     * 在浏览器打开
     */
    vscode.commands.registerCommand('likan.openInBrowser', openBrowser),

    /**
     * 包裹标签
     */
    vscode.commands.registerCommand('likan.htmlWrap', htmlWrap),

    /**
     * 选择运行脚本
     */
    vscode.commands.registerCommand('likan.npmSelect', npmSelect),

    /**
     * 运行脚本
     */
    vscode.commands.registerCommand('likan.npmStart', npmStart),

    /**
     * 在新窗口打开文件夹
     */
    vscode.commands.registerCommand('likan.openInNewWindow', openInNewWindow),

    /**
     * 在当前窗口打开文件夹
     */
    vscode.commands.registerCommand(
      'likan.openInCurrentWindow',
      openInCurrentWindow
    ),

    /**
     * 切换terminal
     */
    vscode.commands.registerCommand('likan.terminalToggle', terminal),

    /**
     * 下载包
     */
    vscode.commands.registerCommand('likan.installPackage', installPackage),

    /**
     * 卸载包
     */
    vscode.commands.registerCommand('likan.uninstallPackage', uninstallPackage),

    /**
     * 更改包版本
     */
    vscode.commands.registerCommand(
      'likan.changePackageByVersion',
      changePackageByVersion
    ),

    /**
     *
     */
    vscode.commands.registerCommand('likan.runScript', npmRun)
  )
}

export function deactivate() {}
