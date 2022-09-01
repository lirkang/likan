/**
 * @Author likan
 * @Date 2022/8/22 10:55:23
 * @FilePath E:\WorkSpace\likan\src\commands\npm.ts
 */

import { NPM_MANAGER_MAP } from '@/constants';
import { getConfig, thenableToPromise } from '@/utils';

export default async function runScript(fsPath: string, script: string, needAdditionalArgument: false) {
  if (!script || !fsPath) return;

  const directionPath = path.dirname(fsPath);

  const manager =
    (vscode.workspace
      .getConfiguration('likan', vscode.Uri.parse(directionPath))
      .get('enum.manager') as Config['manager']) ?? getConfig('manager');

  const terminal = vscode.window.createTerminal({ name: script });

  let value = '';

  if (needAdditionalArgument) {
    value = await thenableToPromise(vscode.window.showInputBox({ placeHolder: '输入传递的参数' }));
  }

  vscode.window.terminals.find(({ name }) => name === `${NPM_MANAGER_MAP[manager]} ${script} ${value}`)?.dispose();

  terminal.sendText(`cd ${directionPath}`);
  terminal.sendText(`${NPM_MANAGER_MAP[manager]} ${script} ${value}`);
  terminal.show();
}
