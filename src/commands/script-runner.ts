/**
 * @Author likan
 * @Date 2022/8/22 10:55:23
 * @FilePath E:\WorkSpace\likan\src\commands\npm.ts
 */

import { FALSE, TRUE } from '@/common/constants';

export default async function runScript(
  parameters: Array<string>,
  terminalName = 'likan-script-runner',
  needShow = TRUE,
  disposeAfterRun = FALSE
) {
  vscode.window.terminals.find(({ name }) => name === terminalName)?.dispose();
  const terminal = vscode.window.createTerminal({ name: terminalName });

  if (needShow) terminal.show();

  for (const parameter of parameters) {
    terminal.sendText(parameter);
  }

  setTimeout(() => {
    if (disposeAfterRun) terminal.dispose();
  }, 1000);
}
