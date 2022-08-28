/**
 * @Author likan
 * @Date 2022-08-07 20:08:33
 * @FilePath D:\CodeSpace\Dev\likan\src\command\index.ts
 */

import tagsWrap from './html.wrap';
import insertComment from './insert.comment';
import scriptsRunner from './npm';
import openBrowser from './open.browser';
import { openCurrent, openNew } from './open.window';
import terminal from './terminal';

const commands: Commands = [
  /** 在浏览器打开 */
  ['likan.open.browser', openBrowser],

  /** 包裹标签 */
  ['likan.language.wrap', tagsWrap],

  /** 运行脚本 */
  ['likan.other.scriptsRunner', scriptsRunner],

  /** 插入注释 */
  ['likan.language.comment', insertComment],

  /** 切换显示终端 */
  ['likan.open.terminal', terminal],

  /** 在当前窗口中打开文件夹。 */
  ['likan.open.currentWindow', openCurrent],

  /** 在新窗口中打开文件夹。 */
  ['likan.open.newWindow', openNew],
];

export default commands.map(([c, e]) => vscode.commands.registerCommand(c, e));
