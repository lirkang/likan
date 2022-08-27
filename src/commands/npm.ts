/**
 * @Author likan
 * @Date 2022/8/22 10:55:23
 * @FilePath E:\WorkSpace\likan\src\commands\npm.ts
 */

import { FALSE, NPM_MANAGER_MAP, PACKAGE_JSON, UNDEFINED } from '@/constants';
import { getConfig, getRootPath, thenableToPromise, toFirstUpper, verifyExistAndNotDirectory } from '@/utils';

export async function selectScript(filepath: string) {
  if (!filepath) return vscode.window.showInformationMessage('没有找到package.json');

  const fsPath = path.join(filepath, PACKAGE_JSON);
  const quickPicker = vscode.window.createQuickPick();

  if (verifyExistAndNotDirectory(fsPath)) {
    const packageJson = fs.readFileSync(fsPath, 'utf-8');
    const scripts: Record<string, string> = JSON.parse(packageJson).scripts ?? {};
    const keys = Object.keys(scripts);
    const manager = getConfig('manager');

    if (!scripts || !keys.length) return vscode.window.showErrorMessage('没有找到可执行的命令');

    const quickPickItem = keys.map(label => ({ label, detail: scripts[label] }));

    quickPicker.items = quickPickItem.filter(({ detail, label }) => detail && label);
    quickPicker.placeholder = '选择需要执行的脚本';

    quickPicker.onDidChangeSelection(([{ label }]) => runScript(`${NPM_MANAGER_MAP[manager]} ${label}`, filepath));
    quickPicker.show();
  } else {
    const quickPickItem = fs.readdirSync(filepath).filter(dir => fs.statSync(path.join(filepath, dir)).isDirectory());

    quickPicker.items = quickPickItem.map(d => ({ label: d }));
    quickPicker.placeholder = '选择目录';

    quickPicker.onDidChangeSelection(([{ label }]) => selectScript(path.join(filepath, label)));
    quickPicker.show();
  }
}

export async function runScript(script: string, path: string) {
  vscode.window.terminals.find(({ name }) => name === script)?.dispose();

  const value = await thenableToPromise(vscode.window.showInputBox({ placeHolder: '输入传递的参数' }));
  const terminal = vscode.window.createTerminal({ name: script });

  terminal.sendText(`cd ${path}`);
  terminal.sendText(`${script} ${value}`);
  terminal.show();
}

export default async function npmSelect() {
  const rootPath = getRootPath(UNDEFINED, FALSE);
  const { workspaceFolders } = vscode.workspace;

  if (rootPath) return selectScript(rootPath);
  if (!workspaceFolders?.length) return;

  const {
    length,
    '0': { uri },
  } = workspaceFolders;

  if (length > 1) {
    const quickPicker = vscode.window.createQuickPick();
    const quickPickItem = workspaceFolders.map(({ uri }) => ({ label: toFirstUpper(uri.fsPath) }));

    quickPicker.items = quickPickItem.filter(({ label }) => fs.statSync(label).isDirectory());
    quickPicker.placeholder = '选择目录';

    quickPicker.onDidChangeSelection(([{ label }]) => selectScript(label));
    quickPicker.show();
  } else {
    selectScript(uri.fsPath);
  }
}
