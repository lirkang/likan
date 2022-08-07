/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import { htmlWrap } from './html-wrap'
import insertComment from './insert-comment'
import { npmSelect, npmStart } from './npm'
import { openBrowser } from './open-browser'
import { terminal } from './terminal'

export const commands = [
  /** 在浏览器打开 */
  { command: 'likan.openInBrowser', func: openBrowser },

  /** 包裹标签 */
  { command: 'likan.htmlWrap', func: htmlWrap },

  /** 选择运行脚本 */
  { command: 'likan.npmSelect', func: npmSelect },

  /** 运行脚本 */
  { command: 'likan.npmStart', func: npmStart },

  /** 切换terminal */
  { command: 'likan.terminalToggle', func: terminal },

  /** 插入注释 */
  { command: 'likan.insertComment', func: insertComment }
]
