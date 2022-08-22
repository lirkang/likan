/**
 * @Author likan
 * @Date 2022/8/22 10:55:26
 * @FilePath E:\WorkSpace\likan\src\commands\open.browser.ts
 */

import open = require('open');

export default function openBrowser({ fsPath }: vscode.Uri) {
  open(fsPath);
}
