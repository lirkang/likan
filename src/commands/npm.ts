import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

import { NPM_MANAGER_MAP, PACKAGE_JSON } from '@/constants';
import { getConfig, getRootPath, thenableToPromise, toFirstUpper } from '@/utils';

async function selectScript(path: string) {
  if (!path) return vscode.window.showInformationMessage('没有找到package.json');

  if (existsSync(join(path, PACKAGE_JSON))) {
    const packageJson = readFileSync(join(path, PACKAGE_JSON), 'utf-8');

    const scripts = (JSON.parse(packageJson).scripts ?? {}) as Record<string, string>;

    const scriptsKeys = Object.keys(scripts);

    if (!scripts || !scriptsKeys.length) return vscode.window.showErrorMessage('没有找到可执行的命令');

    const quickPick: Array<vscode.QuickPickItem> = scriptsKeys
      .map(label => ({ label, detail: scripts[label] }))
      .filter(({ detail }) => detail)
      .filter(({ label }) => label);

    thenableToPromise(vscode.window.showQuickPick(quickPick, { placeHolder: '选择需要执行的脚本' }), 'label').then(
      script => runScript(`${NPM_MANAGER_MAP[getConfig('manager')]} ${script}`, path)
    );
  } else {
    const dirs = readdirSync(path)
      .filter(dir => statSync(join(path, dir)).isDirectory())
      .filter(
        dir =>
          readdirSync(join(path, dir)).find(d => statSync(join(path, dir, d)).isDirectory()) ||
          existsSync(join(path, dir, PACKAGE_JSON))
      );

    if (!dirs.length) return;

    thenableToPromise(vscode.window.showQuickPick(dirs, { placeHolder: '选择目录' })).then(dir =>
      selectScript(join(path, dir))
    );
  }
}

async function runScript(script: string, path: string) {
  const value = await thenableToPromise(vscode.window.showInputBox({ placeHolder: '输入传递的参数' }));

  vscode.window.terminals.find(({ name }) => name === script)?.dispose();

  const terminal = vscode.window.createTerminal({ name: script });

  terminal.sendText(`cd ${path}`);
  terminal.sendText(`${script} ${value}`);

  terminal.show();
}

export default async function npmSelect() {
  if (vscode.window.activeTextEditor && existsSync(vscode.window.activeTextEditor?.document.uri.fsPath))
    return selectScript(getRootPath()!);

  if (!vscode.workspace.workspaceFolders?.length) return;

  if (vscode.workspace.workspaceFolders.length > 1) {
    const quickPick: Array<vscode.QuickPickItem> = vscode.workspace.workspaceFolders
      .filter(({ uri }) => statSync(uri.fsPath).isDirectory)
      .filter(({ uri }) =>
        readdirSync(uri.fsPath).find(
          f => statSync(join(uri.fsPath, f)).isDirectory() || existsSync(join(uri.fsPath, f, PACKAGE_JSON))
        )
      )
      .map(({ uri }) => ({ label: toFirstUpper(uri.fsPath) }));

    thenableToPromise(vscode.window.showQuickPick(quickPick, { placeHolder: '选择目录' }), 'label').then(selectScript);
  } else {
    selectScript(vscode.workspace.workspaceFolders[0].uri.fsPath);
  }
}

export { runScript, selectScript };
