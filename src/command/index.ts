/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import { htmlWrap } from './html-wrap';
import insertComment from './insert-comment';
import { npmSelect, npmStart } from './npm';
import { openBrowser } from './open-browser';
import { terminal } from './terminal';

export const commands: Array<[string, (...args: any) => void]> = [
  /** 在浏览器打开 */
  ['likan.openInBrowser', openBrowser],

  /** 包裹标签 */
  ['likan.htmlWrap', htmlWrap],

  /** 选择运行脚本 */
  ['likan.npmSelect', npmSelect],

  /** 运行脚本 */
  ['likan.npmStart', npmStart],

  /** 切换terminal */
  ['likan.terminalToggle', terminal],

  /** 插入注释 */
  ['likan.insertComment', insertComment],
];
