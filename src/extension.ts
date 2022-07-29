/**
 * @Author likan
 * @Date 2022-05-22 21:35:41
 * @FilePath D:\CodeSpace\Dev\extension\likan\src\extension.ts
 */

import * as vscode from 'vscode'
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
import { terminal } from './command/terminal'
// import './other/codelens'
import './statusBar'

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    /** 在浏览器打开 */
    vscode.commands.registerCommand('likan.openInBrowser', openBrowser),

    /** 包裹标签 */
    vscode.commands.registerCommand('likan.htmlWrap', htmlWrap),

    /** 选择运行脚本 */
    vscode.commands.registerCommand('likan.npmSelect', npmSelect),

    /** 运行脚本 */
    vscode.commands.registerCommand('likan.npmStart', npmStart),

    /** 切换terminal */
    vscode.commands.registerCommand('likan.terminalToggle', terminal),

    /** 下载包 */
    vscode.commands.registerCommand('likan.installPackage', installPackage),

    /** 卸载包 */
    vscode.commands.registerCommand('likan.uninstallPackage', uninstallPackage),

    /** 更改包版本 */
    vscode.commands.registerCommand(
      'likan.changePackageByVersion',
      changePackageByVersion
    ),

    /** 运行脚本 */
    vscode.commands.registerCommand('likan.runScript', npmRun)
  )
}

export function deactivate() {}
