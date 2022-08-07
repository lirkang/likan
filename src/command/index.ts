/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import * as vscode from 'vscode'
import { htmlWrap } from './html-wrap'
import insertComment from './insert-comment'
import { npmSelect, npmStart } from './npm'
import { openBrowser } from './open-browser'
import { terminal } from './terminal'

export const commands = [
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

  /** 插入注释 */
  vscode.commands.registerCommand('likan.insertComment', insertComment)
]
