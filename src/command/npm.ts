import { NPM_MANAGER_MAP } from '@/constants';
import { getConfig, getRootPath } from '@/utils';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { window } from 'vscode';

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

export default function npmSelect() {
  const rootPath = getRootPath();

  if (!rootPath) return;

  return selectScript(rootPath);
}

export { runScript, selectScript };
