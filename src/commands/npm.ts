/**
 * @Author likan
 * @Date 2022/8/22 10:55:23
 * @FilePath E:\WorkSpace\likan\src\commands\npm.ts
 */

import { Config, EMPTY_STRING, FALSE, NPM_MANAGER_MAP } from '@/common/constants';
import { getConfig } from '@/common/utils';

export default async function runScript(fsPath: string, script: string, needAdditionalArgument = FALSE) {
  if (!script || !fsPath) return;

  const directionPath = path.dirname(fsPath);

  const manager: Config['manager'] =
    vscode.workspace.getConfiguration('likan', vscode.Uri.parse(directionPath)).get('enum.manager') ??
    getConfig('manager');

  let value = EMPTY_STRING;

  if (needAdditionalArgument) {
    const parameters = await vscode.window.showInputBox({ placeHolder: '输入传递的参数' });
    if (!parameters) return;

    value = parameters;
  }

  const terminalName = `${NPM_MANAGER_MAP[manager]} ${script} ${value}`;

  vscode.window.terminals.find(({ name }) => name === terminalName)?.dispose();
  const terminal = vscode.window.createTerminal({ name: terminalName });

  terminal.sendText(`cd ${directionPath}`);
  terminal.sendText(terminalName);
  terminal.show();
}
