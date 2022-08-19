/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import htmlWrap from './html-wrap';
import insertComment from './insert-comment';
import npmSelect from './npm';
import openBrowser from './open-browser';
import terminal from './terminal';

const commands: Commands = [
  /** 在浏览器打开 */
  ['likan.language.openInBrowser', openBrowser],

  /** 包裹标签 */
  ['likan.language.htmlWrap', htmlWrap],

  /** 选择运行脚本 */
  ['likan.npm.select', npmSelect],

  /** 插入注释 */
  ['likan.language.insertComment', insertComment],

  /** 切换显示终端 */
  ['likan.title.terminal', terminal],
];

export default commands;
