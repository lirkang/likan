import { NPM_MANAGER_MAP, PACKAGE_JSON } from '@/constants';
import { getConfig, getRootPath, thenableToPromise, toFirstUpper, verifyExistAndNotDirectory } from '@/utils';

async function selectScript(filepath: string) {
  if (!filepath) return vscode.window.showInformationMessage('没有找到package.json');

  const fsPath = path.join(filepath, PACKAGE_JSON);

  if (verifyExistAndNotDirectory(fsPath)) {
    const packageJson = fs.readFileSync(fsPath, 'utf-8');

    const scripts: Record<string, string> = JSON.parse(packageJson).scripts ?? {};

    const scriptsKeys = Object.keys(scripts);

    if (!scripts || !scriptsKeys.length) return vscode.window.showErrorMessage('没有找到可执行的命令');

    const quickPick: Array<vscode.QuickPickItem> = scriptsKeys
      .map(label => ({ label, detail: scripts[label] }))
      .filter(({ detail, label }) => detail && label);

    thenableToPromise(vscode.window.showQuickPick(quickPick, { placeHolder: '选择需要执行的脚本' }), 'label').then(
      script => runScript(`${NPM_MANAGER_MAP[getConfig('manager')]} ${script}`, filepath)
    );
  } else {
    const dirs = fs
      .readdirSync(filepath)
      .filter(dir => fs.statSync(path.join(filepath, dir)).isDirectory())
      .filter(
        dir =>
          fs.readdirSync(path.join(filepath, dir)).find(d => fs.statSync(path.join(filepath, dir, d)).isDirectory()) ||
          verifyExistAndNotDirectory(path.join(filepath, dir, PACKAGE_JSON))
      );

    if (!dirs.length) return;

    thenableToPromise(vscode.window.showQuickPick(dirs, { placeHolder: '选择目录' })).then(dir =>
      selectScript(path.join(filepath, dir))
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
  const rootPath = getRootPath(undefined, false);

  if (rootPath) return selectScript(rootPath);

  if (!vscode.workspace.workspaceFolders?.length) return;

  if (vscode.workspace.workspaceFolders.length > 1) {
    const quickPick: Array<vscode.QuickPickItem> = vscode.workspace.workspaceFolders
      .filter(({ uri }) => fs.statSync(uri.fsPath).isDirectory())
      .filter(({ uri }) =>
        fs
          .readdirSync(uri.fsPath)
          .find(
            f =>
              fs.statSync(path.join(uri.fsPath, f)).isDirectory() ||
              verifyExistAndNotDirectory(path.join(uri.fsPath, f, PACKAGE_JSON))
          )
      )
      .map(({ uri }) => ({ label: toFirstUpper(uri.fsPath) }));

    thenableToPromise(vscode.window.showQuickPick(quickPick, { placeHolder: '选择目录' }), 'label').then(selectScript);
  } else {
    selectScript(vscode.workspace.workspaceFolders[0].uri.fsPath);
  }
}

export { runScript, selectScript };
