/**
 * @Author likan
 * @Date 2022/8/15 16:05:41
 * @FilePath E:\WorkSpace\likan\src\commands\terminal.ts
 */

import { window } from 'vscode';

window.onDidChangeActiveTerminal(e => {
  if (!e) return;

  console.log(e);
});

export default function terminal() {
  window.onDidCloseTerminal(({ processId }) => {
    console.log(processId);
  });
}
