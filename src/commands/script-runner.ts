/**
 * @Author likan
 * @Date 2022/8/22 10:55:23
 * @Filepath E:/TestSpace/extension/likan/src/commands/script-runner.ts
 */

import { Utils } from 'vscode-uri';

import { exist } from '@/common/utils';

export default async function scriptRunner(
  cwd?: vscode.Uri,
  parameters: Array<string> = [],
  terminalName = 'likan-script-runner',
  needShow = true,
  disposeAfterRun = false,
  disposePreSame = false
) {
  if (cwd && exist(cwd)) {
    const { type } = await vscode.workspace.fs.stat(cwd);

    if (type === vscode.FileType.File) cwd = Utils.dirname(cwd);
  }

  if (disposePreSame) {
    vscode.window.terminals.find(({ name }) => name === terminalName)?.dispose();
  }

  const terminal = vscode.window.createTerminal({ cwd, name: terminalName });

  if (needShow) terminal.show();

  for (const parameter of parameters) {
    terminal.sendText(parameter);
  }

  setTimeout(() => {
    if (disposeAfterRun) terminal.dispose();
  }, 1000);
}
