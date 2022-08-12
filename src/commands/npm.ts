import { NPM_MANAGER_MAP } from '@/constants';
import { getConfig, getRootPath, toFirstUpper } from '@/utils';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { QuickPickItem, window, workspace } from 'vscode';

async function selectScript(path: string, script = '') {
  if (existsSync(join(path, '/package.json'))) {
    const { manager } = getConfig();

    if (!script) {
      const packageJson = readFileSync(join(path, '/package.json'), 'utf-8');

      const scripts = JSON.parse(packageJson).scripts;

      const scriptsKeys = Object.keys(scripts);

      if (!scripts || !scriptsKeys.length) return;

      const quickPick = scriptsKeys
        .map(label => ({ label, detail: scripts[label] }))
        .filter(({ detail }) => detail)
        .filter(({ label }) => label);

      const pickScript = await window.showQuickPick(quickPick, { placeHolder: '选择需要执行的脚本' });

      if (!pickScript) return;

      script = pickScript.label;
    }

    runScript(`${NPM_MANAGER_MAP[manager]} ${script}`, path, 'likan');
  } else {
    const dir = readdirSync(path).filter(filePath => statSync(`${path}/${filePath}`).isDirectory());

    if (!dir.length) return;

    const folderPath = await window.showQuickPick(dir, { placeHolder: '选择目录' });

    if (!folderPath) return;

    selectScript(join(path, folderPath), script);
  }
}

function runScript(script: string, path: string, name: string) {
  const s = `${script}`;

  const existTerminal = window.terminals.find(({ name: tName }) => tName === s);

  if (existTerminal) {
    existTerminal.dispose();
  }

  const terminal = window.createTerminal({ name: s });

  terminal.sendText(`cd ${path}`);
  terminal.sendText(script);

  terminal.show();
}

export default async function npmSelect() {
  if (window.activeTextEditor) {
    const rootPath = getRootPath(window.activeTextEditor.document.uri);

    if (!rootPath) return;

    selectScript(rootPath);
  } else if (workspace.workspaceFolders) {
    if (workspace.workspaceFolders.length > 1) {
      const quickPick: Array<QuickPickItem> = workspace.workspaceFolders.map(({ uri }) => ({
        label: toFirstUpper(uri.fsPath),
      }));

      const result = await window.showQuickPick(quickPick, { placeHolder: '选择目录' });

      if (!result) return;

      selectScript(result.label);
    } else {
      selectScript(workspace.workspaceFolders[0].uri.fsPath);
    }
  }
}

export { runScript, selectScript };
