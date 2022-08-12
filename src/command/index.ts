/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import htmlWrap from './html-wrap';
import insertComment from './insert-comment';
import npmSelect from './npm';
import openBrowser from './open-browser';

export const commands: Array<[string, (...args: any) => void]> = [
  /** 在浏览器打开 */
  ['likan.other.openInBrowser', openBrowser],

  /** 包裹标签 */
  ['likan.other.htmlWrap', htmlWrap],

  /** 选择运行脚本 */
  ['likan.npm.select', npmSelect],

  /** 插入注释 */
  ['likan.other.insertComment', insertComment],
];
